import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RavePayment } from '../payments/models/rave.payment.model';

@Injectable()
export class RaveService {
  constructor(private configService: ConfigService) {

  }

  async verifyPayment(transactionId: string) {
    try {
      const response = await axios
        .get(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
          {
            headers: { Authorization: `Bearer ${process.env.RAVE_SECKEY}` },
          });
      if (response?.data?.data) {
        if (response.data.status === 'success') {
          const raveData = response.data.data;
          return {
            currency: raveData.currency,
            amount: raveData.amount,
            paymentId: null,
            txId: raveData.id,
            txRef: raveData.tx_ref,
            flwRef: raveData.flw_ref,
            accountId: raveData.account_id,
            paymentType: raveData.payment_type,
            customerName: raveData.customer?.name,
            customerEmail: raveData.customer?.email,
            customerPhone: raveData.customer?.phone_number,
            created: raveData.created_at,
            status: raveData.status,
            cardType: raveData.card?.type,
            meta: raveData.meta
          };
        } else {
          throw new Error('Verification Failed.');
        }
      } else {
        throw new Error('Verification Failed');
      }
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

}
