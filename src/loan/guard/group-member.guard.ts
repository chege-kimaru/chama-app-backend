import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoanService } from '../loan.service';

@Injectable()
export class GroupMemberGuard implements CanActivate {
    constructor(private loanService: LoanService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: any = context.switchToHttp().getRequest();
        return this.loanService.isGroupMember(req.Group.id, req.user.id);
    }
}