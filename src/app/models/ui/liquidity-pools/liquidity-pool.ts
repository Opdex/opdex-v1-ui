import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MiningPool } from '@sharedModels/ui/mining-pools/mining-pool';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { LiquidityPoolSummary } from '@sharedModels/ui/liquidity-pools/summaries/liquidity-pool-summary';
import { LiquidityPoolTokens } from '@sharedModels/ui/liquidity-pools/liquidity-pool-tokens';

export class LiquidityPool {
  private _address: string;
  private _name: string;
  private _transactionFeePercent: FixedDecimal;
  private _market: string;
  private _tokens: LiquidityPoolTokens;
  private _miningPool: MiningPool;
  private _summary: LiquidityPoolSummary;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get address(): string {
    return this._address;
  }

  public get name(): string {
    return this._name;
  }

  public get transactionFeePercent(): FixedDecimal {
    return this._transactionFeePercent;
  }

  public get market(): string {
    return this._market;
  }

  public get tokens() {
    return this._tokens;
  }

  public get miningPool(): MiningPool {
    return this._miningPool;
  }

  public get summary(): LiquidityPoolSummary {
    return this._summary;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  public get hasStaking(): boolean {
    return !!this.tokens.staking;
  }

  public get hasMining(): boolean {
    return !!this.miningPool;
  }

  public get trackBy(): string {
    const { summary, miningPool, address } = this;
    const { cost, reserves, staking, volume } = summary;
    const crsPerSrc = cost.crsPerSrc.formattedValue;
    const miningWeight = miningPool?.tokensMining?.formattedValue || 0;
    const stakingWeight = staking?.weight?.formattedValue || 0;
    const volumeUsd = volume.dailyUsd.formattedValue;
    const liquidityUsd = reserves.usd.formattedValue;

    return `${address}-${crsPerSrc}-${miningWeight}-${stakingWeight}-${volumeUsd}-${liquidityUsd}`;
  }

  constructor(pool: ILiquidityPoolResponse) {
    if (!!pool === false) return;

    this._address = pool.address;
    this._name = pool.name;
    this._transactionFeePercent = new FixedDecimal(pool.transactionFeePercent, 1);
    this._market = pool.market;
    this._tokens = new LiquidityPoolTokens(pool.tokens);
    this._miningPool = !!pool.miningPool ? new MiningPool(pool.miningPool) : null;
    this._summary = new LiquidityPoolSummary(pool.summary);
    this._createdBlock = pool.createdBlock;
    this._modifiedBlock = pool.modifiedBlock;
  }
}
