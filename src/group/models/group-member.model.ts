import { ApiProperty } from '@nestjs/swagger';
import {
    BelongsTo,
    BelongsToMany,
    Column, CreatedAt, DataType, Default, ForeignKey, IsUUID, Model,
    NotNull,
    PrimaryKey,
    Table, UpdatedAt
} from 'sequelize-typescript';
import { User } from 'src/auth/models/user.model';
import { Group } from './group.model';

@Table({ tableName: 'group_members' })
export class GroupMember extends Model<GroupMember> {
    @ApiProperty()
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @IsUUID(4)
    @Column
    id: string;

    @NotNull
    @ForeignKey(() => User)
    @Column({ allowNull: false, field: 'user_id' })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @NotNull
    @ForeignKey(() => Group)
    @Column({ allowNull: false, field: 'group_id' })
    groupId: string;

    @BelongsTo(() => Group)
    group: Group;

    @Default(false)
    @NotNull
    @Column({ allowNull: false })
    verified: boolean;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

}
