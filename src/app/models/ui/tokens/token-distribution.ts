import { TokenDistributionHistory } from './token-distribution-history';
import { ITokenDistribution } from '@sharedModels/platform-api/responses/tokens/token.interface';

export class TokenDistribution {
  private _vault: string;
  private _miningGovernance: string;
  private _nextDistributionBlock: number;
  private _history: TokenDistributionHistory[];

  public get vault(): string {
    return this._vault;
  }

  public get miningGovernance(): string {
    return this._miningGovernance;
  }

  public get nextDistributionBlock(): number {
    return this._nextDistributionBlock;
  }

  public get history(): TokenDistributionHistory[] {
    return this._history || [];
  }

  constructor(distribution: ITokenDistribution) {
    if (!!distribution === false) return;

    this._vault = distribution.vault;
    this._miningGovernance = distribution.miningGovernance;
    this._nextDistributionBlock = distribution.nextDistributionBlock;
    this._history = distribution.history.map(history => new TokenDistributionHistory(history));
  }
}
