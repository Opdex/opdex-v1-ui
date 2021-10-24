export class SwapAmountInQuoteRequest {
  public tokenOut: string;
  public tokenOutAmount: string;

  constructor(tokenOut: string, tokenOutAmount: string) {
    this.tokenOut = tokenOut;
    this.tokenOutAmount = tokenOutAmount;
  }
}
