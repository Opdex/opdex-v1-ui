export interface ICollectStakingRewardsRequest {
  liquidate: boolean;
}

export class CollectStakingRewardsRequest {
  private _liquidate: boolean;

  public get payload(): ICollectStakingRewardsRequest {
    return {
      liquidate: this._liquidate
    }
  }

  constructor(liquidate: boolean) {
    this._liquidate = liquidate;
  }
}
