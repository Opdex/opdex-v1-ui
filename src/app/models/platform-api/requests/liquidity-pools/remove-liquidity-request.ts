import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface IRemoveLiquidityRequest {
  liquidity: string;
  amountCrsMin: string;
  amountSrcMin: string;
  recipient: string;
  deadline: number;
}

export class RemoveLiquidityRequest {
  private _liquidity: FixedDecimal;
  private _amountCrsMin: FixedDecimal;
  private _amountSrcMin: FixedDecimal;
  private _recipient: string;
  private _deadline: number;

  public get payload(): IRemoveLiquidityRequest {
    return {
      liquidity: this._liquidity.formattedValue,
      amountCrsMin: this._amountCrsMin.formattedValue,
      amountSrcMin: this._amountSrcMin.formattedValue,
      recipient: this._recipient,
      deadline: this._deadline
    }
  }

  constructor(liquidity: FixedDecimal, amountCrsMin: FixedDecimal, amountSrcMin: FixedDecimal,
              recipient: string, deadline: number) {
    this._liquidity = liquidity;
    this._amountCrsMin = amountCrsMin;
    this._amountSrcMin = amountSrcMin;
    this._recipient = recipient;
    this._deadline = deadline;
  }
}
