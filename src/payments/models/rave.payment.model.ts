import {
  BelongsTo,
  Column, CreatedAt,
  DataType,
  Default, ForeignKey,
  IsUUID,
  Model, NotNull,
  PrimaryKey,
  Table, UpdatedAt,
} from 'sequelize-typescript';
import { Payment } from './payment.model';

@Table({ tableName: 'rave_payments' })
export class RavePayment extends Model<RavePayment> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @Column
  id: string;

  @NotNull
  @Column({ allowNull: false })
  currency: string;

  @NotNull
  @Column({ type: DataType.DECIMAL(20, 2), allowNull: false })
  amount: number;

  @ForeignKey(() => Payment)
  @Column({ field: 'payment_id' })
  paymentId: string;

  @BelongsTo(() => Payment)
  payment: Payment;

  @Column({ field: 'tx_id' })
  txId: string;

  @Column({ field: 'tx_ref' })
  txRef: string;

  @Column({ field: 'flw_ref' })
  flwRef: string;

  @Column({ field: 'order_ref' })
  orderRef: string;

  @Column({ field: 'rave_ref' })
  raveRef: string;

  @Column({ field: 'account_id' })
  accountId: string;

  @Column({ field: 'account_name' })
  accountName: string;

  @Column({ field: 'rave_payment_id' })
  ravePaymentId: string;

  @Column({ field: 'payment_type' })
  paymentType: string;

  @Column({ field: 'customer_name' })
  customerName: string;

  @Column({ field: 'customer_email' })
  customerEmail: string;

  @Column({ field: 'customer_phone' })
  customerPhone: string;

  @Column
  created: string;

  @Column
  status: string;

  @Column({ field: 'card_type' })
  cardType: string;

  @NotNull
  @CreatedAt
  @Column({ allowNull: false, field: 'created_at' })
  createdAt: Date;

  @NotNull
  @UpdatedAt
  @Column({ allowNull: false, field: 'updated_at' })
  updatedAt: Date;
}
