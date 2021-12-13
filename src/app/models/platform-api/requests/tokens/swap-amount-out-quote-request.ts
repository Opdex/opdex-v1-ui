import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface ISwapAmountOutQuoteRequest {
  tokenIn: string;
  tokenInAmount: string;
}

export class SwapAmountOutQuoteRequest {
  private _tokenIn: string;
  private _tokenInAmount: FixedDecimal;

  public get payload(): ISwapAmountOutQuoteRequest {
    return {
      tokenIn: this._tokenIn,
      tokenInAmount: this._tokenInAmount.formattedValue
    }
  }

  constructor(tokenIn: string, tokenInAmount: FixedDecimal) {
    this._tokenIn = tokenIn;
    this._tokenInAmount = tokenInAmount;
  }
}
