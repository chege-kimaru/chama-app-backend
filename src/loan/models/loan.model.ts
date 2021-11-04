import { ApiProperty } from '@nestjs/swagger';
import {
    BelongsTo,
    BelongsToMany,
    Column, CreatedAt, DataType, Default, ForeignKey, HasMany, IsUUID, Model,
    NotNull,
    PrimaryKey,
    Table, UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/auth/models/user.model';
import { Group } from 'src/group/models/group.model';
import { Payment } from 'src/payments/models/payment.model';
import { LoanPayment } from './loan-payment.model';
import { LoanProduct } from './loan-product.model';

@Table({ tableName: 'loans' })
export class Loan extends Model<Loan> {
    @ApiProperty()
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @IsUUID(4)
    @Column
    id: string;

    @NotNull
    @ForeignKey(() => Group)
    @Column({ allowNull: false, field: 'group_id' })
    groupId: string;

    @BelongsTo(() => Group)
    group: Group;

    @NotNull
    @ForeignKey(() => User)
    @Column({ allowNull: false, field: 'user_id' })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @NotNull
    @ForeignKey(() => LoanProduct)
    @Column({ allowNull: false, field: 'loan_product_id' })
    loanProductId: string;

    @BelongsTo(() => LoanProduct)
    loanProduct: LoanProduct;

    @NotNull
    @Column({ allowNull: false })
    amount: number;

    @NotNull
    @Column({ allowNull: false })
    deadline: Date;

    // monthly interest rate
    @NotNull
    @Column({ allowNull: false, field: 'interest_rate' })
    interestRate: number;

    @Default(0)
    @NotNull
    @Column({ allowNull: false, field: 'amount_paid' })
    amountPaid: number;

    @NotNull
    @Column({ allowNull: false, field: 'amount_to_be_paid' })
    amountToBePaid: number;

    @Default(false)
    @NotNull
    @Column({ allowNull: false, field: 'payment_complete' })
    paymentComplete: boolean;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @HasMany(() => LoanPayment)
    loanPayments: LoanPayment[];
}
