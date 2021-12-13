export interface IRewardMiningPoolsRequest {
  fullDistribution: boolean;
}

export class RewardMiningPoolsRequest {
  private _fullDistribution: boolean;

  public get payload(): IRewardMiningPoolsRequest {
    return {
      fullDistribution: this._fullDistribution
    }
  }

  constructor(fullDistribution: boolean){
    this._fullDistribution = fullDistribution;
  }
}
