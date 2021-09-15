import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  Column, CreatedAt,
  DataType,
  Default, IsUUID,
  Model,
  PrimaryKey,
  Table, Unique, UpdatedAt, BelongsToMany, HasOne, AllowNull, HasMany,
} from 'sequelize-typescript';
import { ChangePasswordCode } from './change-password-code';
import { PhoneVerificationCode } from './phone-verification-code.model';
import { Role } from './role.model';
import { UserRole } from './user-role.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {

  @ApiProperty()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @Column
  id: string;

  @ApiProperty()
  @Default(false)
  @AllowNull(false)
  @Column({ field: 'phone_verified' })
  phoneVerified: boolean;

  @AllowNull(false)
  @Column({ allowNull: false })
  password: string;

  @ApiProperty()
  @AllowNull(false)
  @Column({ allowNull: false })
  phone: string;

  @ApiProperty()
  @AllowNull(false)
  @Column({ allowNull: false })
  name: string;

  @ApiProperty()
  @AllowNull(false)
  @Column({ allowNull: false })
  email: string;

  @ApiProperty()
  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  // @ApiProperty()
  @BelongsToMany(() => Role, () => UserRole)
  roles: Array<Role & { UserRole: UserRole }>;

  @HasOne(() => PhoneVerificationCode)
  phoneVerificationCode: PhoneVerificationCode;

  @HasOne(() => ChangePasswordCode)
  changePasswordCode: ChangePasswordCode;
}
