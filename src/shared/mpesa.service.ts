/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Mpesa } from "mpesa-api";

@Injectable()
export class MpesaService {
    private mpesaBulk: Mpesa;
    private mpesaPaybill: Mpesa;

    constructor(private configService: ConfigService) {

        this.mpesaBulk = new Mpesa(
            {
                client_key: this.configService.get('MPESA_BULK_CLIENT_KEY'),
                client_secret: this.configService.get('MPESA_BULK_CLIENT_SECRET_KEY'),
                initiator_password: this.configService.get('MPESA_BULK_INITIATOR_PASSWORD'),
                security_credential: this.configService.get('MPESA_BULK_SECURITY_CREDENTIAL'),
                // certificatepath: null,
            },
            this.configService.get('MPESA_BULK_ENVIRONMENT')
        );

        this.mpesaPaybill = new Mpesa(
            {
                client_key: this.configService.get('MPESA_PAYBILL_CLIENT_KEY'),
                client_secret: this.configService.get('MPESA_PAYBILL_CLIENT_SECRET_KEY'),
                initiator_password: this.configService.get('MPESA_PAYBILL_INITIATOR_PASSWORD'),
                security_credential: this.configService.get('MPESA_PAYBILL_SECURITY_CREDENTIAL'),
                // certificatepath: null,
            },
            this.configService.get('MPESA_PAYBILL_ENVIRONMENT')
        );
    }

    async lipaNaMpesa(phone: string, amount: number, description: string, callbackUrl: string) {
        let res;
        try {
            phone = this.formatPhone(phone);
            res = await this.mpesaPaybill.lipaNaMpesaOnline({
                BusinessShortCode: this.configService.get<number>('MPESA_PAYBILL_SHORT_CODE'), // Lipa Na Mpesa Online Shortcode on test credentials page
                Amount: amount /* 1000 is an example amount */,
                PartyA: phone, // use your real phone number
                PartyB: this.configService.get('MPESA_PAYBILL_SHORT_CODE'), // LiAccount Referencepa Na Mpesa Online Shortcode on test credentials page
                PhoneNumber: phone, // use your real phone number
                CallBackURL: `${this.configService.get('SERVER_URL')}/${callbackUrl}`, // this is where the api sends a callback. It must a hosted endpoint with public access.
                AccountReference: "111110", // This is what the customer would have put as account number if they used normal mpesa
                passKey: this.configService.get<number>('MPESA_PAYBILL_PASS_KEY'), // Lipa na mpesa passkey in test credentials page
                TransactionType: "CustomerPayBillOnline" /* OPTIONAL */,
                TransactionDesc: description /* OPTIONAL */,
            });
            console.log(res);
            return res;
        } catch (e) {
            console.log(res);
            throw e;
        }
    };

    payB2c(phone: string, amount: number, resultUrl: string, queueTimeOutUrl: string) {
        phone = this.formatPhone(phone);
        return this.mpesaBulk.b2c({
            Initiator: this.configService.get('MPESA_BULK_INITIATOR_NAME'),
            Amount: amount /* 1000 is an example amount */,
            PartyB: this.configService.get('MPESA_BULK_ENVIRONMENT') === 'sandbox' ?
                this.configService.get('MPESA_BULK_TEST_PHONE') :
                phone, // use your real phone number
            PartyA: this.configService.get('MPESA_BULK_SHORT_CODE'), // LiAccount Referencepa Na Mpesa Online Shortcode on test credentials page
            CommandID: "BusinessPayment",
            QueueTimeOutURL: `${this.configService.get('SERVER_URL')}/${queueTimeOutUrl}`,
            ResultURL: `${this.configService.get('SERVER_URL')}/${resultUrl}`,
        });
    };


    formatPhone(phone: string) {
        if (phone.startsWith('0')) {
            phone = `254${phone.substr(1)}`;
        } else if (phone.startsWith('+')) {
            phone = phone.substr(1);
        }
        return phone;
    }

    b2cCharge(amount: number) {
        if (amount >= 50 && amount <= 1000) {
            return 15.27;
        } else if (amount > 1000) {
            return 22.40;
        } else {
            return 0;
        }
    }
}