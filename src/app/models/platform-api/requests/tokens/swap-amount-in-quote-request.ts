import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface ISwapAmountInQuoteRequest {
  tokenOut: string;
  tokenOutAmount: string;
}

export class SwapAmountInQuoteRequest {
  private _tokenOut: string;
  private _tokenOutAmount: FixedDecimal;

  public get payload(): ISwapAmountInQuoteRequest {
    return {
      tokenOut: this._tokenOut,
      tokenOutAmount: this._tokenOutAmount.formattedValue
    }
  }

  constructor(tokenOut: string, tokenOutAmount: FixedDecimal) {
    this._tokenOut = tokenOut;
    this._tokenOutAmount = tokenOutAmount;
  }
}
