import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

export interface IApproveAllowanceRequest {
  amount: string;
  spender: string;
}

export class ApproveAllowanceRequest {
  private _amount: FixedDecimal;
  private _spender: string;

  public get payload(): IApproveAllowanceRequest {
    return {
      amount: this._amount.formattedValue,
      spender: this._spender
    }
  }

  constructor(amount: FixedDecimal, spender: string) {
    this._amount = amount;
    this._spender = spender;
  }
}
