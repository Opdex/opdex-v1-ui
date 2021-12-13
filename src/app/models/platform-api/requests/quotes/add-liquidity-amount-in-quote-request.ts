import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface IAddLiquidityAmountInQuoteRequest {
  amountIn: string;
  tokenIn: string;
}

export class AddLiquidityAmountInQuoteRequest {
  private _amountIn: FixedDecimal;
  private _tokenIn: string;

  public get payload(): IAddLiquidityAmountInQuoteRequest {
    return {
      amountIn: this._amountIn.formattedValue,
      tokenIn: this._tokenIn,
    }
  }

  constructor(amountIn: FixedDecimal, tokenIn: string) {
    this._amountIn = amountIn;
    this._tokenIn = tokenIn;
  }
}
