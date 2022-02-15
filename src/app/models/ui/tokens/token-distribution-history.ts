import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { ITokenDistributionHistory } from "@sharedModels/platform-api/responses/tokens/token.interface";

export class TokenDistributionHistory {
  private _vault: FixedDecimal;
  private _miningGovernance: FixedDecimal;
  private _block: number;

  public get vault(): FixedDecimal {
    return this._vault;
  }

  public get miningGovernance(): FixedDecimal {
    return this._miningGovernance;
  }

  public get block(): number {
    return this._block;
  }

  constructor(history: ITokenDistributionHistory) {
    this._vault = new FixedDecimal(history.vault, history.vault.split('.')[0].length);
    this._miningGovernance = new FixedDecimal(history.miningGovernance, history.miningGovernance.split('.')[0].length);
    this._block = history.block;
  }
}
