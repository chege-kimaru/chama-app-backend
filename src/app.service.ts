import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
  constructor(private mailerService: MailerService) {
  }
  getHello(): string {
    this
      .mailerService
      .sendMail({
        to: 'kevinkimaru99@gmail.com',
        from: 'kevin@lloydconstellations.com',
        subject: 'Testing Nest Mailermodule with template ✔',
        // template: __dirname + '/welcome',
        template: 'welcome',
        context: {
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then(() => Logger.verbose('Email sent'))
      .catch((e) => Logger.error(e));
    return 'Hello World!';
  }
}
