import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { GroupService } from 'src/group/group.service';
import { LoanService } from '../loan.service';

@Injectable()
export class GroupMiddleware implements NestMiddleware {
    constructor(private loanService: LoanService) {
    }

    async use(req: any, res: Response, next: Function) {
        try {
            const group = await this.loanService.findGroupById(req.params.groupId);
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