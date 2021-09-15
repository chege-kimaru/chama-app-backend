import {
    BelongsTo,
    Column, CreatedAt,
    DataType,
    Default, ForeignKey, HasOne,
    IsUUID,
    Model, NotNull,
    PrimaryKey,
    Table, UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/auth/models/user.model';
import { Payment } from './payment.model';

@Table({ tableName: 'mpesa_c2b_payments' })
export class MpesaC2BPayment extends Model<MpesaC2BPayment> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @IsUUID(4)
    @Column
    id: string;

    @NotNull
    @ForeignKey(() => User)
    @Column({ type: DataType.UUIDV4, field: 'user_id', allowNull: false })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Payment)
    @Column({ field: 'payment_id' })
    paymentId: string;

    @BelongsTo(() => Payment)
    payment: Payment;

    @Column({ field: 'merchant_request_id' })
    merchantRequestId: string;

    @Column({ field: 'checkout_request_id' })
    checkoutRequestId: string;

    @Column({ field: 'result_code' })
    resultCode: string;

    @Column({ field: 'result_desc' })
    resultDesc: string;

    @Column({ field: 'amount', type: DataType.DECIMAL(20, 2) })
    amount: number;

    @Column({ field: 'mpesa_receipt_number' })
    mpesaReceiptNumber: string;

    @Column({ field: 'balance', type: DataType.DECIMAL(20, 2) })
    balance: number;

    @Column({ field: 'transaction_date' })
    transactionDate: string;

    @Column({ field: 'phone_number' })
    phoneNumber: string;

    @NotNull
    @CreatedAt
    @Column({ allowNull: false, field: 'created_at' })
    createdAt: Date;

    @NotNull
    @UpdatedAt
    @Column({ allowNull: false, field: 'updated_at' })
    updatedAt: Date;
}
