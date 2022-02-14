import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IVaultResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-response-model.interface';

export class Vault {
  private _vault: string;
  private _token: string;
  private _tokensLocked: FixedDecimal;
  private _tokensUnassigned: FixedDecimal;
  private _tokensProposed: FixedDecimal;
  private _totalPledgeMinimum: FixedDecimal;
  private _totalVoteMinimum: FixedDecimal;
  private _vestingDuration: number;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get vault(): string {
    return this._vault;
  }

  public get token(): string {
    return this._token;
  }

  public get tokensLocked(): FixedDecimal {
    return this._tokensLocked;
  }

  public get tokensUnassigned(): FixedDecimal {
    return this._tokensUnassigned;
  }

  public get tokensProposed(): FixedDecimal {
    return this._tokensProposed;
  }

  public get totalPledgeMinimum(): FixedDecimal {
    return this._totalPledgeMinimum;
  }

  public get totalVoteMinimum(): FixedDecimal {
    return this._totalVoteMinimum;
  }

  public get vestingDuration(): number {
    return this._vestingDuration;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  constructor(vault: IVaultResponseModel) {
    this._vault = vault.vault;
    this._token = vault.token;
    this._tokensLocked = new FixedDecimal(vault.tokensLocked, 8);
    this._tokensUnassigned = new FixedDecimal(vault.tokensUnassigned, 8);
    this._tokensProposed = new FixedDecimal(vault.tokensProposed, 8);
    this._totalPledgeMinimum = new FixedDecimal(vault.totalPledgeMinimum, 8);
    this._totalVoteMinimum = new FixedDecimal(vault.totalVoteMinimum, 8);
    this._vestingDuration = vault.vestingDuration;
    this._createdBlock = vault.createdBlock;
    this._modifiedBlock = vault.modifiedBlock;
  }
}
