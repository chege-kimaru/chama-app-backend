import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SavingService } from '../saving.service';

@Injectable()
export class GroupMemberGuard implements CanActivate {
    constructor(private savingService: SavingService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: any = context.switchToHttp().getRequest();
        return this.savingService.isGroupMember(req.Group.id, req.user.id);
    }
}