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

@Table({ tableName: 'mpesa_b2c_payments' })
export class MpesaB2CPayment extends Model<MpesaB2CPayment> {
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

    @Column({ field: 'response_code' })
    responseCode: string;

    @Column({ field: 'response_description' })
    responseDescription: string;

    @Column({ field: 'result_type' })
    resultType: string;

    @Column({ field: 'result_code' })
    resultCode: string;

    @Column({ field: 'result_desc' })
    resultDesc: string;

    @Column({ field: 'originator_conversation_id' })
    originatorConversationId: string;

    @Column({ field: 'conversation_id' })
    conversationId: string;

    @Column({ field: 'transaction_id' })
    transactionId: string;

    @Column({ field: 'transaction_amount', type: DataType.DECIMAL(20, 2) })
    transactionAmount: number;

    @Column({ field: 'transaction_receipt' })
    transactionReceipt: string;

    @Column({ field: 'b2c_recipient_is_registered_customer' })
    b2cRecipientIsRegisteredCustomer: string;

    @Column({ field: 'b2c_charges_paid_account_available_funds', type: DataType.DECIMAL(20, 2) })
    b2cChargesPaidAccountAvailableFunds: number;

    @Column({ field: 'receiver_party_public_name' })
    receiverPartyPublicName: string;

    @Column({ field: 'transaction_completed_date_time' })
    transactionCompletedDateTime: string;

    @Column({ field: 'b2c_utility_account_available_funds', type: DataType.DECIMAL(20, 2) })
    b2cUtilityAccountAvailableFunds: number;

    @Column({ field: 'b2c_working_account_available_funds', type: DataType.DECIMAL(20, 2) })
    b2cWorkingAccountAvailableFunds: number;

    @NotNull
    @CreatedAt
    @Column({ allowNull: false, field: 'created_at' })
    createdAt: Date;

    @NotNull
    @UpdatedAt
    @Column({ allowNull: false, field: 'updated_at' })
    updatedAt: Date;
}
