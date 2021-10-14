export interface ITransactionBroadcastNotificationRequest {
    //[Required]
    walletAddress: Address;
    //[Required]
    transactionHash: string;
}