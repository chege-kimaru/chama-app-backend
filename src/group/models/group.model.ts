import { ApiProperty } from '@nestjs/swagger';
import {
    BelongsTo,
    BelongsToMany,
    Column, CreatedAt, DataType, Default, ForeignKey, IsUUID, Model,
    NotNull,
    PrimaryKey,
    Table, UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/auth/models/user.model';

@Table({ tableName: 'groups' })
export class Group extends Model<Group> {
    @ApiProperty()
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @IsUUID(4)
    @Column
    id: string;

    @NotNull
    @Column({ allowNull: false })
    name: string;

    @NotNull
    @ForeignKey(() => User)
    @Column({ allowNull: false, field: 'admin_id' })
    adminId: string;

    @BelongsTo(() => User)
    admin: User;

    @NotNull
    @Column({ allowNull: false })
    code: number;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;
}
