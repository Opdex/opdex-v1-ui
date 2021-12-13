export interface ICreateStakingMarketQuoteRequest {
  stakingToken: string;
}

export class CreateStakingMarketQuoteRequest {
  private _stakingToken: string;

  public get payload(): ICreateStakingMarketQuoteRequest {
    return {
      stakingToken: this._stakingToken
    }
  }

  constructor(stakingToken: string) {
    this._stakingToken = stakingToken;
  }
}
