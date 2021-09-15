import {
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

@Table({ tableName: 'user_roles' })
export class UserRole extends Model<UserRole> {
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

  @ForeignKey(() => Role)
  @Column({ field: 'role_id' })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
