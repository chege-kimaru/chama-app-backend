export const b2cResDto = (data: any) => {
    const returnData: any = {};

    data = data?.Result;
    returnData.resultType = data.ResultType;
    returnData.resultCode = data.ResultCode;
    returnData.resultDesc = data.ResultDesc;
    returnData.originatorConversationId = data.OriginatorConversationID;
    returnData.conversationId = data.ConversationID;
    returnData.transactionId = data.TransactionID;

    const resultParameters: { Key: string, Value: string }[] = data.ResultParameters?.ResultParameter;
    if (resultParameters?.length) {
        for (const param of resultParameters) {
            if (param.Key === 'TransactionAmount') {
                returnData.transactionAmount = param.Value;
            }
            if (param.Key === 'TransactionReceipt') {
                returnData.transactionReceipt = param.Value;
            }
            if (param.Key === 'B2CRecipientIsRegisteredCustomer') {
                returnData.b2CRecipientIsRegisteredCustomer = param.Value;
            }
            if (param.Key === 'B2CChargesPaidAccountAvailableFunds') {
                returnData.b2CChargesPaidAccountAvailableFunds = param.Value;
            }
            if (param.Key === 'ReceiverPartyPublicName') {
                returnData.receiverPartyPublicName = param.Value;
            }
            if (param.Key === 'TransactionCompletedDateTime') {
                returnData.transactionCompletedDateTime = param.Value;
            }
            if (param.Key === 'B2CUtilityAccountAvailableFunds') {
                returnData.b2CUtilityAccountAvailableFunds = param.Value;
            }
            if (param.Key === 'B2CWorkingAccountAvailableFunds') {
                returnData.b2CWorkingAccountAvailableFunds = param.Value;
            }
        }
    }
    return returnData;
}