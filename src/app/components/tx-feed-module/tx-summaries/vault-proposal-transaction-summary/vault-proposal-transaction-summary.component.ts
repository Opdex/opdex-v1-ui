import { switchMap, tap } from 'rxjs/operators';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IToken, IMarketToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultGovernancesService } from '@sharedServices/platform/vault-governances.service';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ICompleteVaultProposalEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vault-governances/complete-vault-proposal-event.interface';
import { ICreateVaultProposalEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vault-governances/create-vault-proposal-event.interface';
import { IVaultProposalPledgeEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vault-governances/vault-proposal-pledge-event.interface';
import { IVaultProposalVoteEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vault-governances/vault-proposal-vote-event.interface';
import { IVaultProposalWithdrawPledgeEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vault-governances/vault-proposal-withdraw-pledge-event.interface';
import { IVaultProposalWithdrawVoteEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vault-governances/vault-proposal-withdraw-vote-event.interface';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';

@Component({
  selector: 'opdex-vault-proposal-transaction-summary',
  templateUrl: './vault-proposal-transaction-summary.component.html',
  styleUrls: ['./vault-proposal-transaction-summary.component.scss']
})
export class VaultProposalTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  subscription = new Subscription();
  error: string;
  proposalId: number;
  createOrComplete: boolean;
  createOrCompleteType: string;
  createOrCompleteAmount: FixedDecimal;
  createOrCompletePass: boolean;
  isCompleteProposal: boolean;


  pledgeOrVote: boolean;
  pledgeOrVoteAmount: FixedDecimal;
  pledgeOrVoteWithdrawal: boolean;
  crs: IToken;
  vaultToken: IMarketToken;
  // createEvent: ICreateVaultProposalEvent;
  // completeEvent: ICompleteVaultProposalEvent;
  // pledgeEvent: IVaultProposalPledgeEvent;
  // withdrawPledgeEvent: IVaultProposalWithdrawPledgeEvent;
  // voteEvent: IVaultProposalVoteEvent;
  // withdrawVoteEvent: IVaultProposalWithdrawVoteEvent;

  pledgeOrVoteEventTypes = [
    TransactionEventTypes.VaultProposalPledgeEvent,
    TransactionEventTypes.VaultProposalWithdrawPledgeEvent,
    TransactionEventTypes.VaultProposalVoteEvent,
    TransactionEventTypes.VaultProposalWithdrawVoteEvent
  ];

  createOrCompleteEventTypes = [
    TransactionEventTypes.CreateVaultProposalEvent,
    TransactionEventTypes.CompleteVaultProposalEvent,
  ];

  constructor(private _vaultGovernancesService: VaultGovernancesService, private _tokensService: TokensService) { }

  ngOnChanges() {
    const createOrCompleteEvents = this.transaction.events.filter(event => this.createOrCompleteEventTypes.includes(event.eventType));
    const createEvent = createOrCompleteEvents.find(event => event.eventType === TransactionEventTypes.CreateVaultProposalEvent) as ICreateVaultProposalEvent;
    const completeEvent = createOrCompleteEvents.find(event => event.eventType === TransactionEventTypes.CompleteVaultProposalEvent) as ICompleteVaultProposalEvent;
    const pledgeOrVoteEvents = this.transaction.events.filter(event => this.pledgeOrVoteEventTypes.includes(event.eventType));
    const pledgeEvent = pledgeOrVoteEvents.find(event => event.eventType === TransactionEventTypes.VaultProposalPledgeEvent) as IVaultProposalPledgeEvent;
    const withdrawPledgeEvent = pledgeOrVoteEvents.find(event => event.eventType === TransactionEventTypes.VaultProposalWithdrawPledgeEvent) as IVaultProposalWithdrawPledgeEvent;
    const voteEvent = pledgeOrVoteEvents.find(event => event.eventType === TransactionEventTypes.VaultProposalVoteEvent) as IVaultProposalVoteEvent;
    const withdrawVoteEvent = pledgeOrVoteEvents.find(event => event.eventType === TransactionEventTypes.VaultProposalWithdrawVoteEvent) as IVaultProposalWithdrawVoteEvent;

    if (createOrCompleteEvents.length > 1 || pledgeOrVoteEvents.length > 2 || (createOrCompleteEvents.length === 0 && pledgeOrVoteEvents.length === 0)) {
      this.error = 'Unable to read vault proposal transaction.';
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = new Subscription();

    if (pledgeOrVoteEvents.length > 0) {
      this.subscription.add(this._tokensService.getToken('CRS', true).subscribe(crs => {
        this.crs = crs;
        if (pledgeEvent || voteEvent) {
          this.pledgeOrVoteAmount = pledgeEvent ? new FixedDecimal(pledgeEvent.pledgeAmount, crs.decimals) : new FixedDecimal(voteEvent.voteAmount, crs.decimals);
          this.proposalId = pledgeEvent ? pledgeEvent.proposalId : voteEvent.proposalId;
        }
        else if (withdrawPledgeEvent || withdrawVoteEvent) {
          this.pledgeOrVoteAmount = withdrawPledgeEvent
            ? new FixedDecimal(withdrawPledgeEvent.withdrawAmount, crs.decimals)
            : new FixedDecimal(withdrawVoteEvent.withdrawAmount, crs.decimals);
          this.proposalId = withdrawPledgeEvent ? withdrawPledgeEvent.proposalId : withdrawVoteEvent.proposalId;
          this.pledgeOrVoteWithdrawal = true;
        }

        this.pledgeOrVote = true;
      }));
    }

    if (createOrCompleteEvents.length > 0) {
      this.subscription.add(
        this._vaultGovernancesService.getVault(createEvent?.contract || completeEvent?.contract)
          .pipe(
            switchMap(vault => this._tokensService.getMarketToken(vault.token)),
            tap(token => this.vaultToken = token as IMarketToken)
            // Todo: Get Proposal By Id for full Details
          )
          .subscribe(token => {
            // Todo: Using proposal details + log, write the proposals create/complete outcome/status
            this.proposalId = createEvent ? createEvent.proposalId : completeEvent.proposalId;

            if (createEvent) {
              this.createOrCompleteAmount = new FixedDecimal(createEvent.amount, token.decimals);
            } else {
              this.isCompleteProposal = true;
              this.createOrCompletePass = completeEvent.approved;
            }

            this.createOrComplete = true;
          }));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
