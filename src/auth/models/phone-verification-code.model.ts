import {
  AllowNull,
  BelongsTo,
  Column, CreatedAt,
  DataType,
  Default, ForeignKey,
  IsUUID, Model,
  PrimaryKey,
  Table, UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Role } from './role.model';

@Table({ tableName: 'phone_verification_codes' })
export class PhoneVerificationCode extends Model<PhoneVerificationCode> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @Column
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUIDV4, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @AllowNull(false)
  @Column({ allowNull: false })
  code: string;

  @AllowNull(false)
  @Column({ allowNull: false })
  expiry: Date;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
