export const lipaNaMpesaResDto = (data: any) => {
    const returnData: any = {};

    data = data?.Body?.stkCallback;
    returnData.merchantRequestId = data?.MerchantRequestID;
    returnData.checkoutRequestId = data?.CheckoutRequestID;
    returnData.resultCode = data?.ResultCode;
    returnData.resultDesc = data?.ResultDesc;

    const metaData: { Name: string, Value: string }[] = data?.CallbackMetadata?.Item;
    if (metaData) {
        for (const meta of metaData) {
            if (meta.Name === 'Amount') {
                returnData.amount = meta.Value;
            }
            if (meta.Name === 'MpesaReceiptNumber') {
                returnData.mpesaReceiptNumber = meta.Value;
            }
            if (meta.Name === 'Balance') {
                returnData.balance = meta.Value;
            }
            if (meta.Name === 'TransactionDate') {
                returnData.transactionDate = meta.Value;
            }
            if (meta.Name === 'PhoneNumber') {
                returnData.phoneNumber = meta.Value;
            }
        }
    }

    return returnData;
};