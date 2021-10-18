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
import { MpesaB2CPayment } from './mpesa-b2c-payment.model';
import { MpesaC2BPayment } from './mpesa-c2b-payment.model';

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @Column
  id: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @Default('KES')
  @NotNull
  @Column({ allowNull: false })
  currency: string;

  @NotNull
  @Column({ type: DataType.DECIMAL(20, 2), allowNull: false })
  amount: number;

  @Default(false)
  @NotNull
  @Column({ allowNull: false })
  complete: boolean;

  @NotNull
  @CreatedAt
  @Column({ allowNull: false, field: 'created_at' })
  createdAt: Date;

  @NotNull
  @UpdatedAt
  @Column({ allowNull: false, field: 'updated_at' })
  updatedAt: Date;

  @HasOne(() => MpesaB2CPayment)
  mpesaB2CPayment: MpesaB2CPayment;

  @HasOne(() => MpesaC2BPayment)
  mpesaC2BPayment: MpesaC2BPayment;

}
