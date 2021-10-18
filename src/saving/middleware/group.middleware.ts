import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { SavingService } from '../saving.service';

@Injectable()
export class GroupMiddleware implements NestMiddleware {
    constructor(private savingService: SavingService) {
    }

    async use(req: any, res: Response, next: Function) {
        try {
            const group = await this.savingService.findGroupByPk(req.params.groupId);
            if (group?.id) {
                req.Group = group;
                next();
            } else {
                throw new NotFoundException('This group does not exist');
            }
        } catch (e) {
            throw e;
        }
    }
}