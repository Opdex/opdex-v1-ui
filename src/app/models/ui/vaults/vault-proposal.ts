import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IVaultProposalResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-response-model.interface';

export class VaultProposal {
  private _vault: string;
  private _token: string;
  private _proposalId: number;
  private _creator: string;
  private _wallet: string;
  private _amount: FixedDecimal;
  private _description: string;
  private _type: string;
  private _status: string;
  private _expiration: number;
  private _yesAmount: FixedDecimal;
  private _noAmount: FixedDecimal;
  private _pledgeAmount: FixedDecimal;
  private _approved: boolean;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get vault(): string {
    return this._vault;
  }

  public get token(): string {
    return this._token;
  }

  public get proposalId(): number {
    return this._proposalId;
  }

  public get creator(): string {
    return this._creator;
  }

  public get wallet(): string {
    return this._wallet;
  }

  public get amount(): FixedDecimal {
    return this._amount;
  }

  public get description(): string {
    return this._description;
  }

  public get type(): string {
    return this._type;
  }

  public get status(): string {
    return this._status;
  }

  public get expiration(): number {
    return this._expiration;
  }

  public get yesAmount(): FixedDecimal {
    return this._yesAmount;
  }

  public get noAmount(): FixedDecimal {
    return this._noAmount;
  }

  public get pledgeAmount(): FixedDecimal {
    return this._pledgeAmount;
  }

  public get approved(): boolean {
    return this._approved;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  public get trackBy(): string {
    const { proposalId, status, expiration, pledgeAmount, yesAmount, noAmount } = this;
    return `${proposalId}-${status}-${expiration}-${pledgeAmount.formattedValue}-${yesAmount.formattedValue}-${noAmount.formattedValue}`;
  }

  public get percentApproved(): FixedDecimal {
    const oneHundred = FixedDecimal.OneHundred(0);
    const zero = FixedDecimal.Zero(0);

    if (this.yesAmount.isZero) return zero;
    if (this.noAmount.isZero) return oneHundred;

    const totalVotes = this.yesAmount.add(this.noAmount);
    const percentageYes = this.yesAmount.divide(totalVotes);

    return oneHundred.multiply(percentageYes);
  }

  constructor(proposal: IVaultProposalResponseModel) {
    this._vault = proposal.vault;
    this._token = proposal.token;
    this._proposalId = proposal.proposalId,
    this._creator = proposal.creator;
    this._wallet = proposal.wallet;
    this._amount = new FixedDecimal(proposal.amount, proposal.amount.split('.')[1].length);
    this._description = proposal.description;
    this._type = proposal.type;
    this._status = proposal.status;
    this._expiration = proposal.expiration;
    this._yesAmount = new FixedDecimal(proposal.yesAmount, 8);
    this._noAmount = new FixedDecimal(proposal.noAmount, 8);
    this._pledgeAmount = new FixedDecimal(proposal.pledgeAmount, 8);
    this._approved = proposal.approved;
    this._createdBlock = proposal.createdBlock;
    this._modifiedBlock = proposal.modifiedBlock;
  }
}
