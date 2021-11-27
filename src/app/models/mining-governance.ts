import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IMiningGovernance } from '@sharedModels/platform-api/responses/mining-governances/mining-governance.interface';

export class MiningGovernance {
  private _address: string;
  private _periodEndBlock: number;
  private _periodRemainingBlocks: number;
  private _periodBlockDuration: number;
  private _periodsUntilRewardReset: number;
  private _miningPoolRewardPerPeriod: string;
  private _nominationPeriodEndDate: string;
  private _totalRewardsPerPeriod: string;
  private _minedToken: IToken;

  public get address(): string {
    return this._address;
  }

  public get periodEndBlock(): number {
    return this._periodEndBlock;
  }

  public get periodRemainingBlocks(): number {
    return this._periodRemainingBlocks;
  }

  public get periodBlockDuration(): number {
    return this._periodBlockDuration;
  }

  public get periodsUntilRewardReset(): number {
    return this._periodsUntilRewardReset;
  }

  public get miningPoolRewardPerPeriod(): string {
    return this._miningPoolRewardPerPeriod;
  }

  public get totalRewardsPerPeriod(): string {
    return this._totalRewardsPerPeriod;
  }

  public get minedToken(): IToken {
    return this._minedToken;
  }

  public get nominationPeriodEndDate(): string {
    return this._nominationPeriodEndDate;
  }

  constructor (governance: IMiningGovernance) {
    this._address = governance.address;
    this._periodEndBlock = governance.periodEndBlock;
    this._periodRemainingBlocks = governance.periodRemainingBlocks;
    this._periodBlockDuration = governance.periodBlockDuration;
    this._periodsUntilRewardReset = governance.periodsUntilRewardReset;
    this._miningPoolRewardPerPeriod = governance.miningPoolRewardPerPeriod;
    this._totalRewardsPerPeriod = governance.totalRewardsPerPeriod;

    const remainingSeconds = (this.periodRemainingBlocks * 16);
    let date = new Date();
    date.setSeconds(date.getSeconds() + remainingSeconds);
    this._nominationPeriodEndDate = date.toISOString();
  }

  setMinedToken(token: IToken) {
    this._minedToken = token;
  }
}
