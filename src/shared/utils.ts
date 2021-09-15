import { Logger } from "@nestjs/common";
import { FindOptions, Op, WhereOptions } from "sequelize";
import { BaseFilterDto, Order } from "./base-filter.dto";
import { Roles } from "./roles.enum";

export const calculateLimitAndOffset = (page = 1, pageSize = 20) => {
    page = page - 1;
    return { offset: (page * pageSize), limit: pageSize };
}

export const isLocalhost = (req) => {
    return String(req.headers.host).indexOf('localhost') > -1 ||
        String(req.headers.host).indexOf('127.0.0.1') > -1;
}

/**
 * 
 * @param filter 
 * @param queryFields the fields that will be searched eg ['name', 'email']
 */
export const defaultFilterOptions = (filter: BaseFilterDto, a?: string[]): FindOptions => {
    const options: FindOptions = {};
    // pagination
    if (filter?.paginate) {
        const { limit, offset } = calculateLimitAndOffset(filter.page, filter.pageSize);
        options.limit = limit;
        options.offset = offset;
    }

    // from to
    let where: WhereOptions = {};
    if (filter?.dateFrom || filter?.dateTo) {
        where.createdAt = {};
        if (filter?.dateFrom) {
            where.createdAt = { ...(where.createdAt), [Op.gte]: filter.dateFrom };
        }
        if (filter?.dateTo) {
            where.createdAt = { ...(where.createdAt), [Op.lte]: filter.dateTo };
        }
    }

    // search
    if (Object.entries(filter.search || {}).length) {
        where = { ...where };
        for (const [key, value] of Object.entries(filter.search)) {
            where[key] = { [Op.or]: [] };
            value.split(' ').forEach(term => {
                where[key][Op.or].push({ [Op.iLike]: `%${term}%` });
            });
        }
    }
    options.where = where;

    // order
    let order: any = null;
    if (filter?.orders?.length) {
        order = [];
        filter.orders.forEach(o => {
            order.push([o.orderBy, o.orderIn]);
        })
        options.order = order;
    }

    return options;
}


/**
 * 
 * @param filterDto 
 * @param query  {
        _sort: string,
        _order: string,
        _page: number,
        _limit: number,
        field_like: string
    }
 */
export const createFilterFromQueries = (
    filterDto: BaseFilterDto,
    query: any
): BaseFilterDto => {
    Logger.verbose(query);

    if (query._sort && query._order) {
        const o: Order = { orderBy: query._sort, orderIn: query._order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' };
        filterDto.orders?.length ?
            filterDto.orders.unshift(o)
            : filterDto.orders = [o];
    }
    if (query._page && query._limit) {
        filterDto.paginate = true;
        filterDto.page = query._page;
        filterDto.pageSize = query._limit;
    }

    filterDto.search = Object.entries(filterDto.search || {}).length ? filterDto.search : {};
    for (const [queryKey, queryValue] of Object.entries(query)) {
        if (queryKey.indexOf('_like') >= 0) {
            // ["", "field", "_like"]
            const searchArr = queryKey?.split('_');
            filterDto.search[searchArr[0]] = queryValue;
        }
    }

    return filterDto;
}



export const parseIp = (req) =>
    (typeof req.headers['x-forwarded-for'] === 'string'
        && req.headers['x-forwarded-for'].split(',').shift())
    || req.connection?.remoteAddress
    || req.socket?.remoteAddress
    || req.connection?.socket?.remoteAddress;

export const ADMIN_ROLES = [Roles.ADMIN];
export const MANAGER_ROLES = [Roles.ADMIN, Roles.MANAGER];
export const SALES_ROLES = [Roles.ADMIN, Roles.MANAGER, Roles.SALES];
