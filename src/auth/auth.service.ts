import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { MailerService } from '@nestjs-modules/mailer';
import { Sequelize } from 'sequelize-typescript';
import { Role } from './models/role.model';
import { User } from './models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { Transaction } from 'sequelize';
import { PhoneVerificationCode } from './models/phone-verification-code.model';
import moment from 'moment';
import { AfricasTalkingService } from 'src/shared/africas-talking.service';
import { AuthDto } from './dto/auth.dto';
import { PhoneCodeDto } from './dto/phone-code.dto';
import { PhoneDto } from './dto/phone.dto';
import { ChangePasswordCode } from './models/change-password-code';
import { ResetPassDto } from './dto/reset-pass.dto';
import { calculateLimitAndOffset, defaultFilterOptions } from 'src/shared/utils';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserRole } from './models/user-role.model';
import { RoleDto } from './dto/role.dto';
import { UserRoleDto } from './dto/user-role.dto';
import { RegisterDto } from './dto/register.dto';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(PhoneVerificationCode) private phoneVerificationCodeModel: typeof PhoneVerificationCode,
    @InjectModel(ChangePasswordCode) private changePasswordCodeModel: typeof ChangePasswordCode,
    @InjectModel(UserRole) private userRoleModel: typeof UserRole,
    private mailerService: MailerService,
    private configService: ConfigService,
    private africaStalkingService: AfricasTalkingService,
    private sequelize: Sequelize,
    private jwtService: JwtService) {
  }

  formatPhone(phone?: string) {
    return this.africaStalkingService.attemptFormattingPhones([phone])[0];
  }

  async register(registerDto: RegisterDto) {
    const transaction = await this.sequelize.transaction();
    try {
      // format phone number
      registerDto.phone = this.formatPhone(registerDto.phone);

      // check if this phone is already registered
      let user = await this.userModel.findOne({ where: { phone: registerDto.phone }, transaction });
      if (user) {
        throw new ForbiddenException('This phone number has already been registered. Please login or change password if you have forgotten your password');
      }

      // create account
      user = await this.userModel.create({
        ...registerDto,
        password: await bcrypt.hash(registerDto.password, 10),
      }, { transaction });

      // generate and send code. Code expires in 20 minutes
      const code = Math.floor(100000 + Math.random() * 900000);
      const phoneVerificationCode = await this.phoneVerificationCodeModel.findOne({
        where: { userId: user.id, }
      });
      if (phoneVerificationCode) {
        await phoneVerificationCode.update({
          code,
          expiry: moment().add(20, 'minutes').toDate(),
        }, { where: { userId: user.id }, transaction });
      } else {
        await this.phoneVerificationCodeModel.create({
          userId: user.id,
          code,
          expiry: moment().add(20, 'minutes').toDate()
        }, { transaction });
      }

      await this.africaStalkingService.sendSms(
        `Dear client, verification code for your account opening request is ${code}.
        This code will expire after 20 minutes.`,
        [user.phone]
      );

      await transaction.commit();
      return this.userModel.findByPk(user.id, { attributes: { exclude: ['password'] } });
    } catch (e) {
      Logger.error(e.message);
      await transaction.rollback();
      throw e;
    }
  }

  async resendVerificationCode(resendVerifyPhoneDto: PhoneDto) {
    const transaction = await this.sequelize.transaction();
    try {
      // format phone number
      resendVerifyPhoneDto.phone = this.formatPhone(resendVerifyPhoneDto.phone);

      // check if this phone is already registered
      const user = await this.userModel.findOne({ where: { phone: resendVerifyPhoneDto.phone }, transaction });
      if (!user) {
        throw new ForbiddenException('An account with this phone number does not exist. Please register.');
      }

      if (user.phoneVerified) {
        throw new ForbiddenException('This account has already been verified. Please login');
      }

      // generate and send code. Code expires in 20 minutes
      const code = Math.floor(100000 + Math.random() * 900000);
      const phoneVerificationCode = await this.phoneVerificationCodeModel.findOne({
        where: { userId: user.id, }
      });
      if (phoneVerificationCode) {
        await phoneVerificationCode.update({
          code,
          expiry: moment().add(20, 'minutes').toDate(),
        }, { where: { userId: user.id }, transaction });
      } else {
        await this.phoneVerificationCodeModel.create({
          userId: user.id,
          code,
          expiry: moment().add(20, 'minutes').toDate()
        }, { transaction });
      }

      const codeSent = await this.africaStalkingService.sendSms(
        `Dear client, verification code for your account opening request is ${code}.
        This code will expire after 20 minutes.`,
        [user.phone]
      );

      if (!codeSent) {
        throw new InternalServerErrorException('Code not sent. Please contact support');
      }

      await transaction.commit();

      return this.userModel.findByPk(user.id, { attributes: { exclude: ['password'] } });
    } catch (e) {
      Logger.error(e.message);
      await transaction.rollback();
      throw e;
    }
  }

  async verifyPhone(verifyPhoneDto: PhoneCodeDto) {
    console.log(verifyPhoneDto);
    try {
      // format phone number
      verifyPhoneDto.phone = this.formatPhone(verifyPhoneDto.phone);

      let user = await this.userModel.findOne({
        where: { phone: verifyPhoneDto.phone },
        include: [{
          model: PhoneVerificationCode,
          where: {
            code: verifyPhoneDto.code
          }
        }]
      });
      if (user) {
        if (moment().isAfter(moment(user.phoneVerificationCode?.expiry))) {
          throw new ForbiddenException('This code has expired. Please request for a new one.');
        }

        // delete used code
        await this.phoneVerificationCodeModel.destroy({ where: { userId: user.id } });

        // verify user phone number
        user = await user.update({ phoneVerified: true });
        return this.userModel.findByPk(user.id, { attributes: { exclude: ['password'] } });
      } else {
        throw new ForbiddenException('Invalid code');
      }
    } catch (e) {
      throw e;
    }
  }

  async requestChangePassword(phoneDto: PhoneDto) {
    const transaction = await this.sequelize.transaction();
    try {
      // format phone number
      phoneDto.phone = this.formatPhone(phoneDto.phone);

      // check if this phone is already registered
      const user = await this.userModel.findOne({ where: { phone: phoneDto.phone }, transaction });
      if (!user) {
        throw new ForbiddenException('An account with this phone number does not exist. Please register.');
      }

      // if (!user.phoneVerified) {
      //   throw new ForbiddenException('This account has not been verified. Please verify this account first.');
      // }

      // generate and send code. Code expires in 20 minutes
      const code = Math.floor(100000 + Math.random() * 900000);
      const changePasswordCode = await this.changePasswordCodeModel.findOne({
        where: { userId: user.id, }
      });
      if (changePasswordCode) {
        await changePasswordCode.update({
          code,
          expiry: moment().add(20, 'minutes').toDate(),
        }, { where: { userId: user.id }, transaction });
      } else {
        await this.changePasswordCodeModel.create({
          userId: user.id,
          code,
          expiry: moment().add(20, 'minutes').toDate()
        }, { transaction });
      }

      const codeSent = await this.africaStalkingService.sendSms(
        `Dear client, please use this code to reset your password: ${code}.
        This code will expire after 20 minutes.`,
        [user.phone]
      );

      if (!codeSent) {
        throw new InternalServerErrorException('Code not sent. Please contact support');
      }

      await transaction.commit();

      return this.userModel.findByPk(user.id, { attributes: { exclude: ['password'] } });
    } catch (e) {
      Logger.error(e.message);
      await transaction.rollback();
      throw e;
    }
  }

  async changePassword(resetPassDto: ResetPassDto) {
    try {
      // format phone number
      resetPassDto.phone = this.formatPhone(resetPassDto.phone);

      let user = await this.userModel.findOne({
        where: { phone: resetPassDto.phone },
        include: [{
          model: ChangePasswordCode,
          where: {
            code: resetPassDto.code
          }
        }]
      });
      if (user) {
        if (moment().isAfter(moment(user.changePasswordCode?.expiry))) {
          throw new ForbiddenException('This code has expired. Please request for a new one.');
        }

        // delete used code
        await this.changePasswordCodeModel.destroy({ where: { userId: user.id } });

        // verify user phone number if not already verified
        // update password
        const newPass = await bcrypt.hash(resetPassDto.password, 10);
        user = await user.update({ phoneVerified: true, password: newPass });
        return this.userModel.findByPk(user.id, { attributes: { exclude: ['password'] } });
      } else {
        throw new ForbiddenException('Invalid code');
      }
    } catch (e) {
      throw e;
    }
  }


  attemptFormatPhone(phone: string) {
    if (!phone.startsWith('+')) {
      if (phone.startsWith('0')) {
        phone = `+254${phone.substr(1)}`;
      } else {
        phone = `+${phone}`;
      }
    }
    return phone;
  }

  async findUserById(userId: string) {
    return this.userModel.findByPk(userId,
      { attributes: { exclude: ['password'] }, include: [{ model: Role }] });
  }

  async validateUser(phone: string, pass: string): Promise<any> {
    // format phone number
    phone = this.formatPhone(phone);

    const user = await this.userModel.findOne({ where: { phone } });
    if (user) {
      try {
        if (user.phoneVerified && await bcrypt.compare(pass, user.password)) {
          return this.userModel.findByPk(user.id, { attributes: { exclude: ['password'] } });
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  }


  async createDefaultAdmin() {
    const transaction = await this.sequelize.transaction();
    try {
      const userDto = {
        name: this.configService.get('DEFAULT_ADMIN_NAME'),
        email: this.configService.get('DEFAULT_ADMIN_EMAIL'),
        phone: this.configService.get('DEFAULT_ADMIN_PHONE'),
        password: await bcrypt.hash(this.configService.get('DEFAULT_ADMIN_PASSWORD'), 10),
        phoneVerified: true,
      };
      let user = await this.userModel.findOne({ where: { phone: userDto.phone }, transaction });
      if (!user) {
        user = await this.userModel.create(userDto, { transaction });
        const roles = await this.roleModel.findAll({ where: { name: { [Op.or]: ['admin', 'user'] } }, transaction });
        await user.$add('roles', roles, { transaction });
      }
      await transaction.commit();
    } catch (e) {
      Logger.error(e);
      await transaction.rollback();
    }
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      user,
      jwt: this.jwtService.sign(payload),
    };
  }

  getUserRoles(user: User) {
    return user.$get('roles');
  }

  async matchRoles(user: User, roles: Array<string>): Promise<boolean> {
    const userRoles = await this.getUserRoles(user);
    for (const userRole of userRoles) {
      for (const role of roles) {
        if (userRole.name === role) {
          return true;
        }
      }
    }
    return false;
  }

  getVerifiedUsers(filter?: UserFilterDto) {
    const options = defaultFilterOptions(filter);
    options.attributes = { exclude: ['password'] };
    // options.where['phoneVerified'] = true;

    if (filter?.role) {
      options.include = [{
        model: Role, required: true,
        where: { name: filter.role }
      }];
    } else {
      options.include = [{ model: Role, required: false }];
    }


    if (filter.showCount) {
      return this.userModel.findAndCountAll(options);
    } else {
      return this.userModel.findAll(options);
    }
  }

  async getRoles() {
    return this.roleModel.findAll();
  }

  async createRole(dto: RoleDto) {
    try {
      const role = await this.roleModel.findOne({ where: { name: dto.name } });
      if (role) throw new ForbiddenException('This role already exists');
      return this.roleModel.create(dto);
    } catch (e) {
      throw e;
    }
  }

  async deleteRole(roleId: string) {
    try {
      const role = await this.roleModel.findByPk(roleId);
      if (!role) throw new NotFoundException('This role does not exist');
      return role.destroy();
    } catch (e) {
      throw e;
    }
  }

  async createUserRole(dto: UserRoleDto) {
    try {
      const role = await this.roleModel.findByPk(dto.roleId);
      if (!role) throw new NotFoundException('This role does not exist');

      const user = await this.userModel.findByPk(dto.userId);
      if (!user) throw new NotFoundException('This user does not exist');

      const userRole = await this.userRoleModel.findOne({
        where: { userId: dto.userId, roleId: dto.roleId }
      });
      if (userRole) throw new ForbiddenException('This user role already exists');

      return this.userRoleModel.create({ userId: dto.userId, roleId: dto.roleId });
    } catch (e) {
      throw e;
    }
  }

  async deleteUserRole(userRoleId: string) {
    try {
      const userRole = await this.userRoleModel.findByPk(userRoleId);
      if (!userRole) throw new NotFoundException('This user role does not exist');

      return userRole.destroy();
    } catch (e) {
      throw e;
    }
  }
}
