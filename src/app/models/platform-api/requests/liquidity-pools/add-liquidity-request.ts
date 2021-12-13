import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface IAddLiquidityRequest {
  amountCrs: string;
  amountSrc: string;
  amountSrcMin: string;
  amountCrsMin: string;
  recipient: string;
  deadline: number;
}

export class AddLiquidityRequest {
  private _amountCrs: FixedDecimal;
  private _amountSrc: FixedDecimal;
  private _amountSrcMin: FixedDecimal;
  private _amountCrsMin: FixedDecimal;
  private _recipient: string;
  private _deadline: number;

  public get payload(): IAddLiquidityRequest {
    return {
      amountCrs: this._amountCrs.formattedValue,
      amountSrc: this._amountSrc.formattedValue,
      amountSrcMin: this._amountSrcMin.formattedValue,
      amountCrsMin: this._amountCrsMin.formattedValue,
      recipient: this._recipient,
      deadline: this._deadline,
    }
  }

  constructor(amountCrs: FixedDecimal, amountSrc: FixedDecimal, amountCrsMin: FixedDecimal,
              amountSrcMin: FixedDecimal, recipient: string, deadline: number) {
    this._amountCrs = amountCrs;
    this._amountSrc = amountSrc;
    this._amountSrcMin = amountSrcMin;
    this._amountCrsMin = amountCrsMin;
    this._recipient = recipient;
    this._deadline = deadline;
  }
}
