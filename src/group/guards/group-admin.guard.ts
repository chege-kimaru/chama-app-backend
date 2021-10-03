import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { logger } from 'handlebars';
import { Observable } from 'rxjs';
import { GroupService } from '../group.service';

@Injectable()
export class GroupAdminGuard implements CanActivate {
    constructor(private groupService: GroupService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: any = context.switchToHttp().getRequest();
        return req.Group?.adminId === req.user?.id;
    }
}