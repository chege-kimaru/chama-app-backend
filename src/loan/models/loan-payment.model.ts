import { ApiProperty } from '@nestjs/swagger';
import {
    BelongsTo,
    BelongsToMany,
    Column, CreatedAt, DataType, Default, ForeignKey, IsUUID, Model,
    NotNull,
    PrimaryKey,
    Table, UpdatedAt,
} from 'sequelize-typescript';
import { Group } from 'src/group/models/group.model';
import { Payment } from 'src/payments/models/payment.model';
import { Loan } from './loan.model';

@Table({ tableName: 'loan_payments' })
export class LoanPayment extends Model<LoanPayment> {
    @ApiProperty()
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @IsUUID(4)
    @Column
    id: string;

    @NotNull
    @ForeignKey(() => Loan)
    @Column({ allowNull: false, field: 'loan_id' })
    loanId: string;

    @BelongsTo(() => Loan)
    loan: Loan;

    @NotNull
    @Column({ allowNull: false })
    amount: number;

    @NotNull
    @ForeignKey(() => Payment)
    @Column({ allowNull: false, field: 'payment_id' })
    paymentId: string;

    @BelongsTo(() => Payment)
    payment: Payment;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;
}
