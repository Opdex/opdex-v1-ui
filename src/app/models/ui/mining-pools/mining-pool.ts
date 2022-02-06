import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IMiningPool } from '@sharedModels/platform-api/responses/mining-pools/mining-pool.interface';

export class MiningPool {
  private _address: string;
  private _liquidityPool: string;
  private _miningPeriodEndBlock: number;
  private _rewardPerBlock: FixedDecimal;
  private _rewardPerLpt: FixedDecimal;
  private _tokensMining: FixedDecimal;
  private _isActive: boolean;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get address(): string {
    return this._address;
  }

  public get liquidityPool(): string {
    return this._liquidityPool;
  }

  public get miningPeriodEndBlock(): number {
    return this._miningPeriodEndBlock;
  }

  public get rewardPerBlock(): FixedDecimal {
    return this._rewardPerBlock;
  }

  public get rewardPerLpt(): FixedDecimal {
    return this._rewardPerLpt;
  }

  public get tokensMining(): FixedDecimal {
    return this._tokensMining;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  constructor(pool: IMiningPool) {
    this._address = pool.address;
    this._liquidityPool = pool.liquidityPool;
    this._miningPeriodEndBlock = pool.miningPeriodEndBlock;
    this._rewardPerBlock = new FixedDecimal(pool.rewardPerBlock, pool.rewardPerBlock.split('.')[1].length);
    this._rewardPerLpt = new FixedDecimal(pool.rewardPerLpt, pool.rewardPerLpt.split('.')[1].length);
    this._tokensMining = new FixedDecimal(pool.tokensMining, pool.tokensMining.split('.')[1].length);
    this._isActive = pool.isActive;
    this._createdBlock = pool.createdBlock;
    this._modifiedBlock = pool.modifiedBlock;
  }
}
