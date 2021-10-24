export class SwapAmountOutQuoteRequest {
  public tokenIn: string;
  public tokenInAmount: string;

  constructor(tokenIn: string, tokenInAmount: string) {
    this.tokenIn = tokenIn;
    this.tokenInAmount = tokenInAmount;
  }
}
