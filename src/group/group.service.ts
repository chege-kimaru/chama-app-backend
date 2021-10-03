import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/auth/models/user.model';
import { AfricasTalkingService } from 'src/shared/africas-talking.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { VerifyMemberDto } from './dto/verify-member.dto';
import { GroupMember } from './models/group-member.model';
import { Group } from './models/group.model';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group) private groupModel: typeof Group,
        @InjectModel(GroupMember) private groupMemberModel: typeof GroupMember,
        private africasTalkingService: AfricasTalkingService
    ) { }

    async createGroup(dto: CreateGroupDto) {
        try {
            // get last group
            const group = await this.groupModel.findOne({ order: [['createdAt', 'DESC']] });
            if (group) {
                dto.code = +group.code + 1;
            } else {
                dto.code = 1001
            }
            return this.groupModel.create(dto);
        } catch (e) {
            throw e;
        }
    }

    updateGroup(group: Group, dto: CreateGroupDto) {
        return group.update(dto);
    }

    findGroupByPk(groupId: string) {
        return this.groupModel.findByPk(groupId, {
            include: [{ model: User, attributes: { exclude: ['password'] }, as: 'admin' }]
        });
    }

    getGroups(code?: number) {
        let where: any = {};
        if (code) where = { code };
        return this.groupModel.findAll({
            where,
            include: [{ model: User, attributes: { exclude: ['password'] }, as: 'admin' }]
        });
    }

    deleteGroup(group: Group) {
        return group.destroy();
    }

    async joinGroup(groupId: string, userId: string) {
        try {
            // check if already a member of this group
            const member = await this.groupMemberModel.findOne({
                where: { groupId, userId }
            });
            if (member) {
                throw new ForbiddenException('You already are a member of this group');
            }

            return this.groupMemberModel.create({ groupId, userId });
        } catch (e) {
            throw e;
        }
    }

    getGroupMembers(groupId: string, verified = true) {
        return this.groupMemberModel.findAll({
            where: { groupId, verified }, include:
                [{ model: User, attributes: { exclude: ['password'] }, as: 'admin' }]
        });
    }

    getUserGroups(userId: string) {
        return this.groupMemberModel.findAll({
            where: { userId },
            include: [{ model: Group }]
        });
    }

    async verifyGroupMember(group: Group, userId: string, dto: VerifyMemberDto) {
        try {
            // checkif this user has joined group
            const member = await this.groupMemberModel.findOne({
                where: { groupId: group.id, userId: userId },
                include: [{ model: User }]
            });
            if (!member) {
                throw new ForbiddenException('This person has not requested to join your group yet.');
            }

            if (dto.verified) {
                await member.update({ verified: true });
                const sms = `Hello ${member.user.name}, Your request to join ${group.name} has been accepted. Open the app to get started.`;
                this.africasTalkingService.sendSms(sms, [member.user.phone]);
            } else {
                // destroy the request
                await member.destroy();
                // send sms
                const sms = `Hello ${member.user.name}, We are sorry to inform you that your request to join ${group.name} has been rejected.`;
                this.africasTalkingService.sendSms(sms, [member.user.phone]);
            }
            return {};
        } catch (e) {
            throw e;
        }
    }

    async leaveGroup(groupId: string, userId: string) {
        try {
            const member = await this.groupMemberModel.findOne({
                where: { groupId, userId }
            });
            if (!member) {
                throw new ForbiddenException('This user is not a member of this group.');
            }
            return member.destroy();
        } catch (e) {
            throw e;
        }
    }
}
