import { FixedDecimal } from "@sharedModels/types/fixed-decimal";

export interface IStopStakingRequest {
  amount: string;
  liquidate: boolean;
}

export class StopStakingRequest {
  private _amount: FixedDecimal;
  private _liquidate: boolean;

  public get payload(): IStopStakingRequest {
    return {
      amount: this._amount.formattedValue,
      liquidate: this._liquidate
    }
  }

  constructor(amount: FixedDecimal, liquidate: boolean){
    this._amount = amount;
    this._liquidate = liquidate;
  }
}
