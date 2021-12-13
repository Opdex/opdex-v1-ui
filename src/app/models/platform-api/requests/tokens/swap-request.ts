import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

export interface ISwapRequest {
  tokenOut: string,
  tokenInAmount: string;
  tokenOutAmount: string;
  tokenInMaximumAmount: string;
  tokenOutMinimumAmount: string;
  tokenInExactAmount: boolean;
  recipient: string;
  deadline: number;
}

export class SwapRequest {
  private _tokenOut: string;
  private _tokenInAmount: FixedDecimal;
  private _tokenOutAmount: FixedDecimal;
  private _tokenInMaximumAmount: FixedDecimal;
  private _tokenOutMinimumAmount: FixedDecimal;
  private _tokenInExactAmount: boolean;
  private _recipient: string;
  private _deadline: number;

  public get payload(): ISwapRequest {
    return {
      tokenOut: this._tokenOut,
      tokenInAmount: this._tokenInAmount.formattedValue,
      tokenOutAmount: this._tokenOutAmount.formattedValue,
      tokenInMaximumAmount: this._tokenInMaximumAmount.formattedValue,
      tokenOutMinimumAmount: this._tokenOutMinimumAmount.formattedValue,
      tokenInExactAmount: this._tokenInExactAmount,
      recipient: this._recipient,
      deadline: this._deadline
    }
  }

  constructor(tokenOut: string, tokenInAmount: FixedDecimal, tokenOutAmount: FixedDecimal, tokenInMaximumAmount: FixedDecimal,
              tokenOutMinimumAmount: FixedDecimal, tokenInExactAmount: boolean, recipient: string, deadline: number) {
    this._tokenOut = tokenOut;
    this._tokenInAmount = tokenInAmount;
    this._tokenOutAmount = tokenOutAmount;
    this._tokenInExactAmount = tokenInExactAmount;
    this._tokenInMaximumAmount = tokenInMaximumAmount;
    this._tokenOutMinimumAmount = tokenOutMinimumAmount;
    this._recipient = recipient;
    this._deadline = deadline;
  }
}
