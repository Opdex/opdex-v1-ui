import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { Block } from "./block";
import { IBlock } from "./platform-api/responses/blocks/block.interface";
import { ITransactionEvent } from "./platform-api/responses/transactions/transaction-events/transaction-event.interface";
import { ITransactionReceipt } from "./platform-api/responses/transactions/transaction.interface";
import { ITransactionType, TransactionTypes } from '@sharedLookups/transaction-types.lookup';

export class TransactionReceipt {
  private _hash: string;
  private _from: string;
  private _to: string;
  private _newContractAddress?: string;
  private _gasUsed: number;
  private _block: Block;
  private _success: boolean;
  private _events: ITransactionEvent[];
  private _transactionType: ITransactionType;
  private _transactionSummary: string;

  public get hash(): string
  {
    return this._hash;
  }

  public get from(): string
  {
    return this._from;
  }

  public get to(): string
  {
    return this._to;
  }

  public get newContractAddress(): string | null
  {
    return this._newContractAddress;
  }

  public get gasUsed(): number
  {
    return this._gasUsed;
  }

  public get block(): IBlock
  {
    return this._block;
  }

  public get success(): boolean
  {
    return this._success;
  }

  public get events(): ITransactionEvent[]
  {
    return this._events;
  }

  public get transactionType(): ITransactionType {
    return this._transactionType;
  }

  public get transactionSummary(): string {
    return this._transactionSummary;
  }

  constructor(receipt: ITransactionReceipt) {
    this._hash = receipt.hash;
    this._from = receipt.from;
    this._to = receipt.to;
    this._newContractAddress = receipt.newContractAddress;
    this._gasUsed = receipt.gasUsed;
    this._block = new Block(receipt.block);
    this._success = receipt.success;
    this._events = receipt.events;
    this._transactionType = this.findTransactionType();
    this._transactionSummary = this.getTransactionSummary();
  }

  public eventsOfType(eventTypes: TransactionEventTypes[]) {
    return this._events.filter(event => eventTypes.includes(event.eventType));
  }

  public eventTypeExists(eventType: TransactionEventTypes): boolean {
    return this.eventsOfType([eventType]).length > 0;
  }

  // This can be reduced as TransactionEvent classes are implemented where they map to their associated summary
  private findTransactionType(): ITransactionType {
    const types = TransactionTypes
      .filter(txType => this._events.filter(event => txType.targetEvents.includes(event.eventType)).length > 0)
      .sort((a, b) => a.priority - b.priority);

    return types.length > 0 ? {...types[0]} : null;
  }

  private getTransactionSummary(): string {
    switch (this.transactionType?.title) {
      case 'Provide': return this.getProvidingSummary();
      case 'Stake': return this.getStakingSummary();
      case 'Mine': return this.getMiningSummary();
      case 'Vault Certificate': return this.getVaultCertificateSummary();
      case 'Ownership': return this.getOwnershipSummary();
      case 'Swap': return 'Swap';
      case 'Create Pool': return 'Create Pool';
      case 'Enable Mining': return 'Enable Mining';
      case 'Distribute': return 'Distribute';
      case 'Permissions': return 'Set Permission';
      case 'Allowance': return 'Approve Allowance';
      case 'Vault Proposal': return this.getVaultProposalSummary();
      default: return 'Unknown';
    }
  }

  private getProvidingSummary(): string {
    return this.eventTypeExists(TransactionEventTypes.AddLiquidityEvent) ? 'Add Liquidity' : 'Remove Liquidity';
  }

  private getStakingSummary(): string {
    if (this.eventTypeExists(TransactionEventTypes.StartStakingEvent)) return 'Start Staking';
    else if (this.eventTypeExists(TransactionEventTypes.StopStakingEvent)) return 'Stop Staking';
    else return 'Collect Rewards';
  }

  private getMiningSummary(): string {
    if (this.eventTypeExists(TransactionEventTypes.StartMiningEvent)) return 'Start Mining';
    else if (this.eventTypeExists(TransactionEventTypes.StopMiningEvent)) return 'Stop Mining';
    else return 'Collect Rewards';
  }

  private getOwnershipSummary(): string {
    var isPending = this.eventsOfType([
      TransactionEventTypes.ClaimPendingDeployerOwnershipEvent,
      TransactionEventTypes.SetPendingMarketOwnershipEvent,
      TransactionEventTypes.SetPendingVaultOwnershipEvent
    ]).length > 0;

    return isPending ? 'New Pending Owner' : 'Claimed Ownership';
  }

  private getVaultCertificateSummary(): string {
    if (this.eventTypeExists(TransactionEventTypes.CreateVaultCertificateEvent)) return 'Create Vault Certificate';
    else if (this.eventTypeExists(TransactionEventTypes.RedeemVaultCertificateEvent)) return 'Redeem Vault Certificate';
    else return 'Revoke Vault Certificate';
  }

  private getVaultProposalSummary(): string {
    if (this.eventTypeExists(TransactionEventTypes.CreateVaultProposalEvent)) return 'Create Proposal';
    else if (this.eventTypeExists(TransactionEventTypes.CompleteVaultProposalEvent)) return 'Complete Proposal';
    else if (this.eventTypeExists(TransactionEventTypes.VaultProposalPledgeEvent)) return 'Pledge';
    else if (this.eventTypeExists(TransactionEventTypes.VaultProposalWithdrawPledgeEvent)) return 'Withdraw Pledge';
    else if (this.eventTypeExists(TransactionEventTypes.VaultProposalVoteEvent)) return 'Vote';
    else if (this.eventTypeExists(TransactionEventTypes.VaultProposalWithdrawVoteEvent)) return 'Withdraw Vote';
    else return 'Vault Proposal';
  }
}
