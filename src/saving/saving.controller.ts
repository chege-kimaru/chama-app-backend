import { Body, Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { lipaNaMpesaResDto } from 'src/payments/dto/lipa-na-mpesa-res.dto';
import { parseIp } from 'src/shared/utils';
import { AddSavingDto } from './dto/add-saving.dto';
import { GroupMemberGuard } from './guard/group-member.guard';
import { SavingService } from './saving.service';

@ApiTags('Savings')
@UseGuards(JwtAuthGuard, GroupMemberGuard)
@Controller('groups/:groupId/savings')
export class SavingController {
    constructor(private savingService: SavingService) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add Saving' })
    @ApiBody({ type: AddSavingDto })
    @Post()
    addSaving(@Req() req: any, @Body() dto: AddSavingDto) {
        return this.savingService.addSaving(req.Group.id, req.user.id, dto);
    }

    @Post('lipa-na-mpesa-callback')
    lipaNaMpesaCallback(@Req() req: any, @Body() data: any) {
        Logger.verbose({ 'Ip Address': parseIp(req) });
        Logger.verbose(data);
        data = lipaNaMpesaResDto(data);
        Logger.verbose(data);
        return this.savingService.completeMpesaPayment(data, req.Group);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all user group savings' })
    @Get()
    getAllGroupSavings(@Req() req: any) {
        return this.savingService.getAllGroupSavings(req.Group.id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get logged in user group savings' })
    @Get('/user')
    getUserGroupSavings(@Req() req: any) {
        return this.savingService.getUserGroupSavings(req.Group.id, req.user.id);
    }
}
