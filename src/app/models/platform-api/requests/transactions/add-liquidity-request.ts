export interface IAddLiquidityRequest {
    //[Required]
    amountCrs: number;
    //[Required]
    amountSrc: number;
    //[Required]
    amountSrcMin: number;
    //[Required]
    amountCrsMin: number;
    //[Required]
    recipient: Address;
    deadline: number;
}