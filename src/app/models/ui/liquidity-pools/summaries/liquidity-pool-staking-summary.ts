import { MarketToken } from '@sharedModels/ui/tokens/market-token';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IStakingSummaryResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface";

export class LiquidityPoolStakingSummary {
  private _token: MarketToken;
  private _weight: FixedDecimal;
  private _usd: number;
  private _dailyWeightChangePercent: number;
  private _nominated: boolean;

  public get token(): any {
    return this._token;
  }

  public get weight(): FixedDecimal {
    return this._weight;
  }

  public get usd(): number {
    return this._usd;
  }

  public get dailyWeightChangePercent(): number {
    return this._dailyWeightChangePercent;
  }

  public get nominated(): boolean {
    return this._nominated;
  }

  constructor(staking: IStakingSummaryResponse) {
    if (!!staking === false) return;

    this._token = new MarketToken(staking.token);
    this._weight = new FixedDecimal(staking.weight, staking.weight.split('.')[1].length);
    this._usd = staking.usd;
    this._dailyWeightChangePercent = staking.dailyWeightChangePercent;
    this._nominated = staking.nominated;
  }
}
