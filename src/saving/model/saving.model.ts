import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, IsUUID, Model, NotNull, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "src/auth/models/user.model";
import { Group } from "src/group/models/group.model";
import { Payment } from "src/payments/models/payment.model";


@Table({ tableName: 'savings' })
export class Saving extends Model<Saving> {
    @ApiProperty()
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @IsUUID(4)
    @Column
    id: string;

    @ApiProperty()
    @NotNull
    @Column({ allowNull: false })
    amount: number;

    @ApiProperty()
    @NotNull
    @ForeignKey(() => Group)
    @Column({ allowNull: false, field: 'group_id' })
    groupId: string;

    @BelongsTo(() => Group)
    group: Group;

    @ApiProperty()
    @NotNull
    @ForeignKey(() => User)
    @Column({ allowNull: false, field: 'user_id' })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @ApiProperty()
    @NotNull
    @ForeignKey(() => Payment)
    @Column({ allowNull: false, field: 'payment_id' })
    paymentId: string;

    @BelongsTo(() => Payment)
    payment: Payment;

    @ApiProperty()
    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @ApiProperty()
    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;
}