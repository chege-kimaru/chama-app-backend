import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/models/user.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { VerifyMemberDto } from './dto/verify-member.dto';
import { GroupService } from './group.service';
import { GroupAdminGuard } from './guards/group-admin.guard';
import { Group } from './models/group.model';

@ApiTags('Group')
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupController {
    constructor(private groupService: GroupService) { }

    @ApiBearerAuth()
    @ApiBody({ type: CreateGroupDto })
    @ApiResponse({ status: 201, type: Group })
    @Post()
    async createGroup(@Req() req: any, @Body() dto: CreateGroupDto) {
        dto.adminId = req.user?.id;
        return this.groupService.createGroup(dto);
    }

    @ApiBearerAuth()
    @ApiBody({ type: CreateGroupDto })
    @ApiResponse({ status: 200, type: Group })
    @ApiParam({ name: 'groupId' })
    @UseGuards(GroupAdminGuard)
    @Put(':groupId')
    async updateGroup(@Req() req: any, @Body() dto: CreateGroupDto) {
        return this.groupService.updateGroup(req.Group, dto);
    }

    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: Group, isArray: true })
    @ApiQuery({ name: 'code', required: false, type: Number })
    @Get()
    async getGroups(@Req() req: any, @Query() code: number) {
        return this.groupService.getGroups(code);
    }

    @ApiBearerAuth()
    @ApiBody({ type: CreateGroupDto })
    @ApiResponse({ status: 200, type: Group, isArray: true })
    @ApiQuery({ name: 'code', required: false, type: Number })
    @Get('user')
    async getUserGroups(@Req() req: any) {
        return this.groupService.getUserGroups(req.user.id);
    }

    @ApiBearerAuth()
    @ApiParam({ name: 'groupId' })
    @Get(':groupId')
    async getGroupById(@Req() req: any) {
        return req.Group;
    }

    @ApiBearerAuth()
    @ApiBody({ type: CreateGroupDto })
    @ApiParam({ name: 'groupId' })
    @UseGuards(GroupAdminGuard)
    @Delete(':groupId')
    async deleteGroup(@Req() req: any) {
        return this.groupService.deleteGroup(req.Group);
    }

    @ApiBearerAuth()
    @ApiBody({ type: Object })
    @ApiResponse({ status: 201, type: Group })
    @ApiParam({ name: 'groupId' })
    @Post(':groupId/members')
    async joinGroup(@Req() req: any) {
        return this.groupService.joinGroup(req.Group.id, req.user.id);
    }

    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: User, isArray: true })
    @ApiParam({ name: 'groupId' })
    @ApiQuery({ name: 'verified', type: Boolean })
    @Get(':groupId/members')
    async getGroupMembers(@Req() req: any, @Query('verified') verified: boolean) {
        return this.groupService.getGroupMembers(req.Group.id, verified);
    }

    @ApiBearerAuth()
    @ApiParam({ name: 'groupId' })
    @ApiParam({ name: 'userId' })
    @UseGuards(GroupAdminGuard)
    @Delete(':groupId/members/:userId')
    async leaveGroup(@Req() req: any, @Param('userId') userId: string) {
        return this.groupService.leaveGroup(req.Group.id, userId);
    }

    @ApiBearerAuth()
    @ApiBody({ type: VerifyMemberDto })
    @ApiParam({ name: 'groupId' })
    @ApiParam({ name: 'userId' })
    @UseGuards(GroupAdminGuard)
    @Patch(':groupId/members/:userId/verify')
    async verifyMember(@Req() req: any, @Body() dto: VerifyMemberDto, @Param('userId') userId: string) {
        return this.groupService.verifyGroupMember(req.Group, userId, dto);
    }
}
