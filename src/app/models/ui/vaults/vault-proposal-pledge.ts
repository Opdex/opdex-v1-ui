import { IVaultProposalPledgeResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-pledge-response-model.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

export class VaultProposalPledge {
  private _vault: string;
  private _proposalId: number;
  private _pledger: string;
  private _pledge: FixedDecimal;
  private _balance: FixedDecimal;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get vault(): string {
    return this._vault;
  }

  public get proposalId(): number {
    return this._proposalId;
  }

  public get pledger(): string {
    return this._pledger;
  }

  public get pledge(): FixedDecimal {
    return this._pledge;
  }

  public get balance(): FixedDecimal {
    return this._balance;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  public get trackBy(): string {
    const { pledger, pledge, balance } = this;
    return `${pledger}-${pledge.formattedValue}-${balance.formattedValue}`;
  }

  constructor(pledge: IVaultProposalPledgeResponseModel) {
    this._vault = pledge.vault;
    this._proposalId = pledge.proposalId;
    this._pledger = pledge.pledger;
    this._pledge = new FixedDecimal(pledge.pledge, 8);
    this._balance = new FixedDecimal(pledge.balance, 8);
    this._createdBlock = pledge.createdBlock;
    this._modifiedBlock = pledge.modifiedBlock;
  }
}
