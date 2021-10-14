export interface ISwapRequest {
    //[Required]
    tokenOut: Address;
    //[Required]
    tokenInAmount: number;
    //[Required]
    tokenOutAmount: number;
    //[Required]
    tokenInExactAmount: boolean;
    //[Required]
    tokenInMaximumAmount: number;
    //[Required]
    tokenOutMinimumAmount: number;
    //[Required]
    recipient: Address;
    deadline: number;
}