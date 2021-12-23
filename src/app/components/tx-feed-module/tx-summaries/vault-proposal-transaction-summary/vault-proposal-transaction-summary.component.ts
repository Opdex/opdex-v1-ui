import { IVaultGovernanceResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-governance-response-model.interface';
import { IVaultProposalResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-response-model.interface';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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
import { Observable, of, Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { IVaultProposalBaseEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vault-governances/vault-proposal-base-event.interface';

interface IVaultProposalSummary {
  vault: IVaultGovernanceResponseModel,
  proposal: IVaultProposalResponseModel;
  pledgeOrVote: IVaultProposalPledgeOrVoteSummary;
  createOrComplete: IVaultProposalCreateOrCompleteSummary;
  crs: IToken;
  vaultToken: IMarketToken;
}

interface IVaultProposalPledgeOrVoteSummary {
  amount: FixedDecimal;
  withdrawal: boolean;
  inFavor?: boolean;
}

interface IVaultProposalCreateOrCompleteSummary {
  type?: string;
  approved?: boolean;
  amount?: FixedDecimal;
}

@Component({
  selector: 'opdex-vault-proposal-transaction-summary',
  templateUrl: './vault-proposal-transaction-summary.component.html',
  styleUrls: ['./vault-proposal-transaction-summary.component.scss']
})
export class VaultProposalTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  error: string;
  summary: IVaultProposalSummary;
  pledgeOrVoteEvents: IVaultProposalBaseEvent[];
  createOrCompleteEvents: IVaultProposalBaseEvent[];
  subscription = new Subscription();

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
    this.createOrCompleteEvents = this.transaction.events.filter(event => this.createOrCompleteEventTypes.includes(event.eventType)) as IVaultProposalBaseEvent[];
    this.pledgeOrVoteEvents = this.transaction.events.filter(event => this.pledgeOrVoteEventTypes.includes(event.eventType)) as IVaultProposalBaseEvent[];

    if (this.createOrCompleteEvents.length > 1 ||
        this.pledgeOrVoteEvents.length > 1 ||
        (this.createOrCompleteEvents.length === 0 && this.pledgeOrVoteEvents.length === 0)) {
      this.error = 'Unable to read vault proposal transaction.';
      return;
    }

    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
      this.subscription = new Subscription();
    }

    const proposalId = this.createOrCompleteEvents[0]?.proposalId || this.pledgeOrVoteEvents[0]?.proposalId;
    const vault = this.createOrCompleteEvents[0]?.contract || this.pledgeOrVoteEvents[0]?.contract;

    this.subscription.add(
      this._vaultGovernancesService.getProposal(proposalId, vault)
        .pipe(
          catchError(_ => of({} as IVaultProposalResponseModel)),
          map(proposal => { return { proposal } as IVaultProposalSummary }),
          switchMap(summary => this.buildPledgeOrVoteSummary(summary)),
          switchMap(summary => this.buildCreateOrCompleteSummary(summary)))
        .subscribe(summary => this.summary = summary)
    );
  }

  private buildPledgeOrVoteSummary(summary: IVaultProposalSummary): Observable<IVaultProposalSummary> {
    if (this.pledgeOrVoteEvents.length > 0) {
      const pledgeEvent = this.pledgeOrVoteEvents.find(event => event.eventType === TransactionEventTypes.VaultProposalPledgeEvent) as IVaultProposalPledgeEvent;
      const withdrawPledgeEvent = this.pledgeOrVoteEvents.find(event => event.eventType === TransactionEventTypes.VaultProposalWithdrawPledgeEvent) as IVaultProposalWithdrawPledgeEvent;
      const voteEvent = this.pledgeOrVoteEvents.find(event => event.eventType === TransactionEventTypes.VaultProposalVoteEvent) as IVaultProposalVoteEvent;
      const withdrawVoteEvent = this.pledgeOrVoteEvents.find(event => event.eventType === TransactionEventTypes.VaultProposalWithdrawVoteEvent) as IVaultProposalWithdrawVoteEvent;

      return this._tokensService.getToken('CRS', true)
        .pipe(map(crs => {
          summary.crs = crs;
          summary.pledgeOrVote = { inFavor: null } as IVaultProposalPledgeOrVoteSummary;

          if (pledgeEvent || voteEvent) {
            summary.pledgeOrVote.inFavor = pledgeEvent ? null : voteEvent.inFavor;
            summary.pledgeOrVote.amount = pledgeEvent
              ? new FixedDecimal(pledgeEvent.pledgeAmount, crs.decimals)
              : new FixedDecimal(voteEvent.voteAmount, crs.decimals);
          }
          else if (withdrawPledgeEvent || withdrawVoteEvent) {
            summary.pledgeOrVote.withdrawal = true;
            summary.pledgeOrVote.amount = withdrawPledgeEvent
              ? new FixedDecimal(withdrawPledgeEvent.withdrawAmount, crs.decimals)
              : new FixedDecimal(withdrawVoteEvent.withdrawAmount, crs.decimals);
          }

          return summary;
        }));
    }

    return of(summary);
  }

  private buildCreateOrCompleteSummary(summary: IVaultProposalSummary): Observable<IVaultProposalSummary> {
    if (this.createOrCompleteEvents.length > 0) {
      const createEvent = this.createOrCompleteEvents.find(event => event.eventType === TransactionEventTypes.CreateVaultProposalEvent) as ICreateVaultProposalEvent;
      const completeEvent = this.createOrCompleteEvents.find(event => event.eventType === TransactionEventTypes.CompleteVaultProposalEvent) as ICompleteVaultProposalEvent;

      return this._vaultGovernancesService.getVault(createEvent?.contract || completeEvent?.contract)
        .pipe(
          tap(vault => summary.vault = vault),
          switchMap(vault => this._tokensService.getMarketToken(vault.token)),
          map(token => {
            summary.vaultToken = token as IMarketToken;
            summary.createOrComplete = { approved: null };

            if (summary.proposal?.type === 'Create' || createEvent?.type === 'Create') summary.createOrComplete.type = 'New Certificate';
            else if (summary.proposal?.type === 'Revoke' || createEvent?.type === 'Revoke') summary.createOrComplete.type = 'Revoke Certificate';
            else if (summary.proposal?.type === 'TotalPledgeMinimum' || createEvent?.type === 'TotalPledgeMinimum') summary.createOrComplete.type = 'Pledge Change';
            else if (summary.proposal?.type === 'TotalVoteMinimum' || createEvent?.type === 'TotalVoteMinimum') summary.createOrComplete.type = 'Vote Change';

            if (completeEvent) summary.createOrComplete.approved = completeEvent.approved;

            return summary;
          }));
    }

    return of(summary);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
