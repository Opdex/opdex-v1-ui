import { ITokenSummary } from '@sharedModels/platform-api/responses/tokens/token.interface';

export class TokenSummary {
  private _priceUsd: number;
  private _dailyPriceChangePercent: number;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get priceUsd(): number {
    return this._priceUsd;
  }

  public get dailyPriceChangePercent(): number {
    return this._dailyPriceChangePercent;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  constructor(summary: ITokenSummary) {
    this._priceUsd = summary.priceUsd;
    this._dailyPriceChangePercent = summary.dailyPriceChangePercent;
    this._createdBlock = summary.createdBlock;
    this._modifiedBlock = summary.modifiedBlock;
  }
}
