import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import africastalking from 'africastalking';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const appendFileAsync = promisify(fs.appendFile);

// {
//   "SMSMessageData": {
//   "Message": "Sent to 1/1 Total Cost: KES 0.8000",
//     "Recipients": [{
//     "statusCode": 101,
//     "number": "+254711XXXYYY",
//     "status": "Success",
//     "cost": "KES 0.8000",
//     "messageId": "ATPid_SampleTxnId123"
//   }]
// }
// }

export class SMSRecipients {
    statusCode: number;
    number: string;
    status: string;
    cost: string;
    messageId: string;
}

export class SMSMessageData {
    Message: string;
    Recipients: SMSRecipients[];
}

@Injectable()
export class AfricasTalkingService {

    sms: any;

    constructor(private configService: ConfigService) {
        const credentials = {
            apiKey: this.configService.get<string>('AFRICAS_TALKING_API_KEY'),
            username: this.configService.get<string>('AFRICAS_TALKING_USERNAME'),
        };
        const AfricasTalking = africastalking(credentials);
        this.sms = AfricasTalking.SMS;
    }

    /**
     * <p><strong>Attempts to format phone number into the acceptable format eg +254721898685</strong></p>
     * <p>Formatting is done to match Kenya's country code which is the default country code</p>
     * <p>This function does not guarantee that the phone number will be valid</p>
     * <p>The phone number will be formatted only if it does not start start with a +</p>
     * <p>if the number has a 0 at the beginning, the 0 will be replaced with +254 else the number
     * will be prepended with a +</p>
     *
     * @param phones phone numbers to attempt formatting
     */
    attemptFormattingPhones(phones: string[]): string[] {
        return phones.map(phone => {
            if (!phone.startsWith('+')) {
                if (phone.startsWith('0')) {
                    phone = `+254${phone.substr(1)}`;
                } else {
                    phone = `+${phone}`;
                }
            }
            return phone;
        });
    }

    async sendSms(message: string, phones: string[]): Promise<boolean> {
        Logger.verbose('Sending SMS....');
        Logger.verbose(message.length > 100 ? message.substr(0, 100) : message);
        try {
            const options: { to: string[], message: string, from?: string } = {
                to: this.attemptFormattingPhones(phones),
                message,
            };
            if (this.configService.get<string>('AFRICAS_TALKING_SENDER_ID') !== 'sandbox') {
                options.from = this.configService.get<string>('AFRICAS_TALKING_SENDER_ID');
            } else {
                delete options.from;
            }
            const response: { SMSMessageData: SMSMessageData } = await this.sms.send(options);
            let success = true;
            for (const recipient of response?.SMSMessageData?.Recipients) {
                if (recipient.statusCode !== 101 && recipient.status !== 'Success') {
                    success = false;
                    try {
                        await appendFileAsync(path.join(process.cwd(), 'logs/sms.log'),
                            `Message not sent - ${message} - ${new Date()} - Failed with error code ${recipient.statusCode} and status ${recipient.status} - ${phones}\n`,
                            { flag: 'a+' });
                    } catch (e) {
                        Logger.error(e);
                    }
                }
            }
            Logger.verbose(`Status success: ${success}`);
            return success;
        } catch (e) {
            try {
                await appendFileAsync(path.join(process.cwd(), 'logs/sms.log'),
                    `Message not sent - ${message} - ${new Date()} - ${e.message} - ${phones}\n`);
            } catch (e) {
                Logger.error(e);
            }
            Logger.error(e.message);
            return false;
        }
    }
}