import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

export interface IStartStakingRequest {
  amount: string;
}

export class StartStakingRequest {
  private _amount: FixedDecimal;

  public get payload(): IStartStakingRequest {
    return {
      amount: this._amount.formattedValue
    }
  }

  constructor(amount: FixedDecimal){
    this._amount = amount;
  }
}
