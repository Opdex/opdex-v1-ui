import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

export interface IMiningQuote {
  amount: string;
}

export class MiningQuote {
  private _amount: FixedDecimal;

  public get payload(): IMiningQuote {
    return {
      amount: this._amount.formattedValue
    }
  }

  constructor(amount: FixedDecimal) {
    this._amount = amount;
  }
}
