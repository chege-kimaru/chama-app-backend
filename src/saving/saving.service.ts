import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/auth/models/user.model';
import { GroupMember } from 'src/group/models/group-member.model';
import { Group } from 'src/group/models/group.model';
import { MpesaC2BPayment } from 'src/payments/models/mpesa-c2b-payment.model';
import { Payment } from 'src/payments/models/payment.model';
import { AfricasTalkingService } from 'src/shared/africas-talking.service';
import { MpesaService } from 'src/shared/mpesa.service';
import { AddSavingDto } from './dto/add-saving.dto';
import { Saving } from './model/saving.model';

@Injectable()
export class SavingService {
    constructor(
        @InjectModel(Saving) private savingModel: typeof Saving,
        @InjectModel(Group) private groupModel: typeof Group,
        @InjectModel(GroupMember) private groupMemberModel: typeof GroupMember,
        @InjectModel(Payment) private paymentModel: typeof Payment,
        @InjectModel(MpesaC2BPayment) private mpesaC2BPaymentModel: typeof MpesaC2BPayment,
        @InjectModel(User) private userModel: typeof User,
        private mpesaService: MpesaService,
        private sequelize: Sequelize,
        private africasTalkingService: AfricasTalkingService
    ) {

    }

    findGroupByPk(groupId: string) {
        return this.groupModel.findByPk(groupId);
    }

    async isGroupMember(groupId: string, userId: string) {
        return !!(await this.groupMemberModel.findOne({ where: { groupId, userId, verified: true } }));
    }

    addSaving(group: Group, user: User, dto: AddSavingDto) {
        return this.initiateMpesaPayment(group, user, dto.amount);
    }

    getUserGroupSavings(groupId: string, userId: string) {
        return this.savingModel.findAll({ where: { groupId, userId }, order: [['createdAt', 'DESC']] });
    }

    getAllGroupSavings(groupId: string) {
        return this.savingModel.findAll({ where: { groupId }, order: [['createdAt', 'DESC']] });
    }

    async initiateMpesaPayment(group: Group, user: User, amount: number): Promise<boolean> {
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
                `groups/${group.id}/savings/lipa-na-mpesa-callback`
            );
            Logger.verbose(mpesaRes);

            if (+mpesaRes.ResponseCode === 0) {
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

    async completeMpesaPayment(mpesaResData: any, group: Group) {
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

                await this.savingModel.create({
                    groupId: group.id,
                    userId: user.id,
                    paymentId: payment.id,
                    amount: payment.amount
                }, { transaction });

                await transaction.commit();

                //send sms
                this.africasTalkingService.sendSms(
                    `Your saving payment of Ksh ${payment.amount} was successful.`,
                    [user.phone]
                );

            } else {
                await transaction.commit();

                // send failure sms
                this.africasTalkingService.sendSms(
                    'Your saving payment did not go through. Please try again or call support',
                    [user?.phone]
                );
            }
        } catch (e) {
            Logger.verbose(e.message);
            await transaction.rollback();
            // send failure sms
            if (user) {
                this.africasTalkingService.sendSms(
                    'Your saving payment did not go through. Please try again or call support',
                    [user?.phone]
                );
            }
            throw e;
        }
    }
}
