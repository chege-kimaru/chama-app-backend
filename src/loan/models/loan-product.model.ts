import { ApiProperty } from '@nestjs/swagger';
import {
    AutoIncrement,
    Column, CreatedAt, DataType, Default, IsUUID, Model,
    NotNull,
    PrimaryKey,
    Table, UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'loan_products' })
export class LoanProduct extends Model<LoanProduct> {
    @ApiProperty()
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @NotNull
    @Column({ allowNull: false })
    name: string;

    @NotNull
    @Column({ allowNull: false })
    amount: number;

    @NotNull
    @Column({ allowNull: false, field: 'interest_rate' })
    interestRate: number;

    // repayment period in days
    @NotNull
    @Column({ allowNull: false, field: 'repayment_period' })
    repaymentPeriod: number;

    // fine to be charged
    @NotNull
    @Column({ allowNull: false })
    fine: number;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;
}
