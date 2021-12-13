import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

export interface ICollectMarketFeesQuoteRequest {
  token: string;
  amount: string;
}

export class CollectMarketFeesQuoteRequest {
  private _token: string;
  private _amount: FixedDecimal;

  public get payload(): ICollectMarketFeesQuoteRequest {
    return {
      token: this._token,
      amount: this._amount.formattedValue
    }
  }

  constructor(token: string, amount: FixedDecimal){
    this._token = token;
    this._amount = amount;
  }
}
