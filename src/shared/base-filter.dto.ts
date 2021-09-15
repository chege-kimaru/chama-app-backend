import { ApiProperty } from "@nestjs/swagger";

export class Order {
    @ApiProperty({ required: false })
    orderBy?: string;
    @ApiProperty({ required: false })
    orderIn?: 'ASC' | 'DESC';
}

export class BaseFilterDto {
    @ApiProperty({ required: false })
    paginate?: boolean;
    @ApiProperty({ required: false })
    page?: number;
    @ApiProperty({ required: false })
    pageSize?: number;
    @ApiProperty({ required: false })
    q?: string;
    @ApiProperty({ required: false })
    showCount?: boolean;

    /** Sorting */
    orders: Order[];

    @ApiProperty({ required: false })
    dateFrom?: Date;
    @ApiProperty({ required: false })
    dateTo?: Date;

    timezone?: string;

    /**
     * {field: string, searchTerm: value}
     */
    search: Record<string, any>;
}