import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/auth/models/user.model';
import { Group } from 'src/group/models/group.model';
import { MpesaC2BPayment } from 'src/payments/models/mpesa-c2b-payment.model';
import { Payment } from 'src/payments/models/payment.model';
import { AfricasTalkingService } from 'src/shared/africas-talking.service';
import { MpesaService } from 'src/shared/mpesa.service';
import { RequestLoanDto } from './dto/request-loan.dto';
import { LoanProduct } from './models/loan-product.model';
import { Loan } from './models/loan.model';
import moment from 'moment';
import { Saving } from 'src/saving/model/saving.model';
import { LoanPayment } from './models/loan-payment.model';
import { GroupMember } from 'src/group/models/group-member.model';

@Injectable()
export class LoanService {
    constructor(
        @InjectModel(LoanProduct) private loanProductModel: typeof LoanProduct,
        @InjectModel(Loan) private loanModel: typeof Loan,
        @InjectModel(Payment) private paymentModel: typeof Payment,
        @InjectModel(LoanPayment) private loanPaymentModel: typeof LoanPayment,
        @InjectModel(MpesaC2BPayment) private mpesaC2BPaymentModel: typeof MpesaC2BPayment,
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(Saving) private savingModel: typeof Saving,
        @InjectModel(GroupMember) private groupMemberModel: typeof GroupMember,
        @InjectModel(Group) private groupModel: typeof Group,
        private mpesaService: MpesaService,
        private sequelize: Sequelize,
        private africasTalkingService: AfricasTalkingService
    ) {

    }

    findGroupById(groupId) {
        return this.groupModel.findByPk(groupId);
    }

    findLoanById(loanId) {
        return this.loanModel.findByPk(loanId);
    }

    async isGroupMember(groupId: string, userId: string) {
        return !!(await this.groupMemberModel.findOne({ where: { groupId, userId, verified: true } }));
    }

    // TODO Set loan products per group
    getLoanProducts() {
        return this.loanProductModel.findAll();
    }

    getUserGroupLoans(groupId: string, userId: string) {
        return this.loanModel.findAll({ where: { groupId, userId } });
    }

    getGroupLoans(groupId: string) {
        return this.loanModel.findAll({ where: { groupId }, include: [{ model: User, attributes: { exclude: ['password'] } }] });
    }

    getLoanDetails(loanId) {
        return this.loanPaymentModel.findByPk(loanId, { include: [{ model: LoanPayment }] });
    }

    getLoanPayments(loanId) {
        return this.loanPaymentModel.findAll({ where: { loanId } })
    }

    async requestLoan(group: Group, user: User, dto: RequestLoanDto) {
        const transaction = await this.sequelize.transaction();
        try {
            const loanProduct = await this.loanProductModel.findByPk(dto.loanProductId, { transaction });
            if (!loanProduct) {
                throw new NotFoundException('This loan product does not exist');
            }

            // TODO check if savings amount is enough
            // const totalSavings: any[] = await this.savingModel.findAll({
            //     attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'total']],
            //     where: { groupId: group.id },
            //     group: [Sequelize.col('group_id')],
            //     transaction
            // });
            // if(totalSavings[0] < loanProduct.amount) {
            //     throw new ForbiddenException('There is not enough money in the group to loan');
            // } 

            // ============ simulate sending money to user ==============

            // create loan
            const loan = await this.loanModel.create({
                groupId: group.id,
                userId: user.id,
                loanProductId: loanProduct.id,
                amount: Math.ceil(loanProduct.amount),
                deadline: moment().add(loanProduct.repaymentPeriod, 'days').toDate(),
                interestRate: loanProduct.interestRate,
                // TODO formula to calculate amount to be paid
                amountToBePaid: Math.ceil(+loanProduct.amount + (+loanProduct.amount * (+loanProduct.interestRate / 100) * +loanProduct.repaymentPeriod)),
            }, { transaction });

            // TODO update savings balance

            await transaction.commit();

            // send sms that loan has been granted
            const message = 'Your loan request was successful. You have been awarded a loan of Ksh ' + loanProduct.amount;
            this.africasTalkingService.sendSms(message, [user.phone]);

            // TODO send sms to all  other group members

            return loan;
        } catch (e) {
            transaction.rollback();
            throw e;
        }
    }

    async payLoan(group: Group, user: User, loan: Loan, amount: number) {
        // check if loan payment is complete
        if (loan.paymentComplete) {
            throw new ForbiddenException('Loan payment is already complete!');
        }
        return this.initiateMpesaPayment(group, user, loan, amount);
    }

    async initiateMpesaPayment(group: Group, user: User, loan: Loan, amount: number): Promise<boolean> {
        const transaction = await this.sequelize.transaction();
        try {
            // create payment
            const payment = await this.paymentModel.create({
                userId: user.id,
                amount,
                complete: false
            }, { transaction });

            //initialize mpesa
            const mpesaRes = await this.mpesaService.lipaNaMpesa(
                user.phone,
                amount,
                'LIPA NA MPESA PAYMENT',
                `groups/${group.id}/loans/${loan.id}/pay/lipa-na-mpesa-callback`
            );
            Logger.verbose(mpesaRes);

            if (+ mpesaRes.ResponseCode === 0) {
                // create mpesa payment
                await this.mpesaC2BPaymentModel.create({
                    userId: user.id,
                    paymentId: payment.id,
                    merchantRequestId: mpesaRes.MerchantRequestID,
                    checkoutRequestId: mpesaRes.CheckoutRequestID,
                }, { transaction });

                await transaction.commit();
                return true;
            } else {
                await transaction.rollback();
                return false;
            }
        } catch (e) {
            await transaction.rollback();
            Logger.verbose(e.message);
            return false;
        }
    }

    async completeMpesaPayment(mpesaResData: any, group: Group, loan: Loan) {
        const transaction = await this.sequelize.transaction();
        let mpesaPayment: MpesaC2BPayment = null;
        let user: User = null;
        try {
            // get mpesa payment by 
            mpesaPayment = await this.mpesaC2BPaymentModel.findOne({
                where: {
                    merchantRequestId: mpesaResData.merchantRequestId,
                    checkoutRequestId: mpesaResData.checkoutRequestId
                },
                transaction
            });
            if (!mpesaPayment) {
                throw new Error('This Mpesa Payment does not exist');
            }

            // get payment
            const payment = await mpesaPayment.$get('payment', { transaction });

            // get details  for sms sending
            user = await this.userModel.findByPk(payment.userId);

            // update remaining fields
            await mpesaPayment.update({ ...mpesaResData }, { transaction });

            if (+mpesaResData.resultCode === 0) {

                // set it to complete
                await payment.update({ complete: true }, { transaction });

                await this.loanPaymentModel.create({
                    loanId: loan.id,
                    paymentId: payment.id,
                    amount: payment.amount
                }, { transaction });

                // update loan payment amount
                const amountPaid = +loan.amountPaid + +payment.amount;
                await loan.update({
                    amountPaid,
                    paymentComplete: amountPaid >= loan.amountToBePaid
                }, { transaction });

                await transaction.commit();

                //send sms
                // TODO Tell user the remaining balance
                this.africasTalkingService.sendSms(
                    `Your loan payment of Ksh ${payment.amount} was successful.`,
                    [user.phone]
                );

            } else {
                await transaction.commit();

                // send failure sms
                this.africasTalkingService.sendSms(
                    'Your loan payment did not go through. Please try again or call support',
                    [user?.phone]
                );
            }
        } catch (e) {
            Logger.verbose(e.message);
            await transaction.rollback();
            // send failure sms
            if (user) {
                this.africasTalkingService.sendSms(
                    'Your loan payment did not go through. Please try again or call support',
                    [user?.phone]
                );
            }
            throw e;
        }
    }
}
