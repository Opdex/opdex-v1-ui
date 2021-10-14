export interface IRemoveLiquidityRequest {
    //[Required]
    liquidity: number;
    //[Required]
    amountCrsMin: number;
    //[Required]
    amountSrcMin: number;
    //[Required]
    recipient: Address;
    deadline: number;
}