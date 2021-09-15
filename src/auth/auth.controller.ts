import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  HttpCode,
  Req,
  Res, Response, Redirect, Put, Query, Param, Delete
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { AuthDto } from './dto/auth.dto';
import { PhoneCodeDto } from './dto/phone-code.dto';
import { PhoneDto } from './dto/phone.dto';
import { ResetPassDto } from './dto/reset-pass.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles.decorator';
import { UserFilterDto } from './dto/user-filter.dto';
import { DecodeQueryPipe } from 'src/shared/decode-query.pipe';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { RoleDto } from './dto/role.dto';
import { UserRoleDto } from './dto/user-role.dto';
import { ADMIN_ROLES, createFilterFromQueries, MANAGER_ROLES, SALES_ROLES } from 'src/shared/utils';
import { Order } from 'src/shared/base-filter.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService, private configService: ConfigService) {

  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 200, description: 'Registration was successful' })
  @ApiResponse({ status: 400, description: 'Bad request. Please ensure all fields have valid data.' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  register(@Body() userDto: RegisterDto) {
    return this.authService.register(userDto);
  }

  @ApiOperation({ summary: 'Verify Phone' })
  @ApiResponse({ status: 200, description: 'Verification successful' })
  @ApiResponse({ status: 400, description: 'Invalid data | Account already verified | Invalid Token | Link Expired' })
  @ApiBody({ type: PhoneCodeDto })
  @HttpCode(200)
  @Post('verify')
  verifyEmail(@Body() verifyPhoneDto: PhoneCodeDto) {
    return this.authService.verifyPhone(verifyPhoneDto);
  }

  @ApiOperation({ summary: 'Resend Verification Code' })
  @ApiResponse({ status: 200, description: 'Verification code resent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiBody({ type: PhoneDto })
  @HttpCode(200)
  @Post('verify/resend')
  resendVerificationEmail(@Body() resendVerifyPhoneDto: PhoneDto) {
    return this.authService.resendVerificationCode(resendVerifyPhoneDto);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid data | Unverified Account | Account does not exist' })
  @ApiResponse({ status: 401, description: 'Invalid data' })
  @ApiBody({ type: AuthDto })
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged in user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get verified users' })
  @ApiQuery({ name: 'filter', required: false })
  @ApiQuery({ name: '_sort', required: false })
  @ApiQuery({ name: '_order', required: false })
  @ApiQuery({ name: '_page', required: false })
  @ApiQuery({ name: '_limit', required: false })
  @ApiQuery({ name: 'phone_like', required: false })
  @ApiQuery({ name: 'phoneVerified_like', required: false })
  @Roles(SALES_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('users')
  getVerifiedusers(@Query('filter', DecodeQueryPipe) filterDto: UserFilterDto,
    @Query() query: any
  ) {
    filterDto = createFilterFromQueries(filterDto, query);
    return this.authService.getVerifiedUsers(filterDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: PhoneDto })
  @HttpCode(200)
  @Post('request-change-password')
  requestChangePassword(@Body() phoneDto: PhoneDto) {
    return this.authService.requestChangePassword(phoneDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: ResetPassDto })
  @HttpCode(200)
  @Post('change-password')
  changePassword(@Body() resetPassDto: ResetPassDto) {
    return this.authService.changePassword(resetPassDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get roles' })
  @Roles(ADMIN_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('roles')
  getRoles() {
    return this.authService.getRoles();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add role' })
  @ApiBody({ type: RoleDto })
  @HttpCode(200)
  @Roles(ADMIN_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('roles')
  createRole(@Body() roleDto: RoleDto) {
    return this.authService.createRole(roleDto);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete role' })
  @HttpCode(200)
  @ApiParam({ name: 'roleId' })
  @Roles(ADMIN_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('roles/:roleId')
  deleteRole(@Param('roleId') roleId: string) {
    return this.authService.deleteRole(roleId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add user role' })
  @ApiBody({ type: UserRoleDto })
  @HttpCode(200)
  @Roles(ADMIN_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('user-roles')
  createUserRole(@Body() userRoleDto: UserRoleDto) {
    return this.authService.createUserRole(userRoleDto);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete role' })
  @HttpCode(200)
  @ApiParam({ name: 'userRoleId' })
  @Roles(ADMIN_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('user-roles/:userRoleId')
  deleteUserRole(@Param('userRoleId') userRoleId: string) {
    return this.authService.deleteUserRole(userRoleId);
  }
}
