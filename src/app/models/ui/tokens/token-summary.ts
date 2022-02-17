import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { ITokenSummary } from '@sharedModels/platform-api/responses/tokens/token.interface';

export class TokenSummary {
  private _priceUsd: FixedDecimal;
  private _dailyPriceChangePercent: FixedDecimal;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get priceUsd(): FixedDecimal {
    return this._priceUsd;
  }

  public get dailyPriceChangePercent(): FixedDecimal {
    return this._dailyPriceChangePercent;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  constructor(summary: ITokenSummary) {
    this._priceUsd = !summary?.priceUsd ? FixedDecimal.Zero(8) : new FixedDecimal(summary.priceUsd, 8);
    this._dailyPriceChangePercent = !summary?.dailyPriceChangePercent ? FixedDecimal.Zero(8) : new FixedDecimal(summary?.dailyPriceChangePercent, 8);
    this._createdBlock = summary?.createdBlock || 0;
    this._modifiedBlock = summary?.modifiedBlock || 0;
  }
}
