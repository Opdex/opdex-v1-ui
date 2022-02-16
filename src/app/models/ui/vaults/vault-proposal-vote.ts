import { IVaultProposalVoteResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-vote-response-model.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

export class VaultProposalVote {
  private _vault: string;
  private _proposalId: number;
  private _voter: string;
  private _vote: FixedDecimal;
  private _balance: FixedDecimal;
  private _inFavor: boolean;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get vault(): string {
    return this._vault;
  }

  public get proposalId(): number {
    return this._proposalId;
  }

  public get voter(): string {
    return this._voter;
  }

  public get vote(): FixedDecimal {
    return this._vote;
  }

  public get balance(): FixedDecimal {
    return this._balance;
  }

  public get inFavor(): boolean {
    return this._inFavor;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  public get trackBy(): string {
    const { voter, vote, balance } = this;
    return `${voter}-${vote.formattedValue}-${balance.formattedValue}`;
  }

  constructor(vote: IVaultProposalVoteResponseModel) {
    this._vault = vote.vault;
    this._proposalId = vote.proposalId;
    this._voter = vote.voter;
    this._vote = new FixedDecimal(vote.vote, 8);
    this._inFavor = vote.inFavor;
    this._balance = new FixedDecimal(vote.balance, 8);
    this._createdBlock = vote.createdBlock;
    this._modifiedBlock = vote.modifiedBlock;
  }
}
