export interface ITransactionBroadcastNotificationRequest {
    walletAddress: string;
    transactionHash: string;
    isValid?: boolean;
}

export class TransactionBroadcastNotificationRequest implements ITransactionBroadcastNotificationRequest{
    walletAddress: string;
    transactionHash: string;
    isValid?: boolean = true;

    constructor(request: ITransactionBroadcastNotificationRequest) {
        if(!this.walletAddress || !this.transactionHash) {
            this.isValid = false;
        }

        this.transactionHash = request.transactionHash;
        this.walletAddress = request.walletAddress;
    }
}