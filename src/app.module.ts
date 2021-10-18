import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthService } from './auth/auth.service';
import { PaymentsModule } from './payments/payments.module';
import { GroupModule } from './group/group.module';
import { SavingModule } from './saving/saving.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get<any>('DB_DIALECT') || 'mysql',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get<string>('DB_USER') || 'root',
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME') || 'nest_tour',
        autoLoadModels: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          ignoreTLS: configService.get<boolean>('MAIL_IGNORE_TLS'),
          secure: configService.get<boolean>('MAIL_SECURE'),
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `${configService.get('MAIL_FROM')}`,
        },
        preview: true,
        template: {
          dir: path.join(process.cwd(), 'templates/pages'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: path.join(process.cwd(), 'templates/partials'),
            options: {
              strict: true,
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SharedModule,
    PaymentsModule,
    GroupModule,
    SavingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(authService: AuthService) {
    authService.createDefaultAdmin();
  }
}
