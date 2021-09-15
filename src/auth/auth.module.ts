import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RolesGuard } from './guards/roles.guard';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './models/role.model';
import { UserRole } from './models/user-role.model';
import { User } from './models/user.model';
import { PhoneVerificationCode } from './models/phone-verification-code.model';
import { SharedModule } from 'src/shared/shared.module';
import { ChangePasswordCode } from './models/change-password-code';

@Module({
  imports: [
    SequelizeModule.forFeature([Role, UserRole, User, PhoneVerificationCode, ChangePasswordCode]),
    PassportModule,
    SharedModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    })],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtAuthGuard, JwtStrategy,
    RolesGuard],
  controllers: [AuthController],
  exports: [RolesGuard, JwtAuthGuard, LocalAuthGuard, AuthService],
})
export class AuthModule {
}
