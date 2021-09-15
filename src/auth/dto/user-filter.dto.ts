import { BaseFilterDto } from "src/shared/base-filter.dto";

export class UserFilterDto extends BaseFilterDto {
    role?: string;
}