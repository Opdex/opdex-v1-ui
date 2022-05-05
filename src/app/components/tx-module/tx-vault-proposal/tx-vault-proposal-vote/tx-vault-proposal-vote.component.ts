import { Token } from '@sharedModels/ui/tokens/token';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { Component, Injector, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { VaultProposalVoteQuoteRequest } from '@sharedModels/platform-api/requests/vaults/vault-proposal-vote-quote-request.interface';
import { VaultProposalWithdrawVoteQuoteRequest } from '@sharedModels/platform-api/requests/vaults/vault-proposal-withdraw-vote-quote-request.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, take, tap } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { VaultProposal } from '@sharedModels/ui/vaults/vault-proposal';

@Component({
  selector: 'opdex-tx-vault-proposal-vote',
  templateUrl: './tx-vault-proposal-vote.component.html',
  styleUrls: ['./tx-vault-proposal-vote.component.scss']
})
export class TxVaultProposalVoteComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data: any;
  form: FormGroup;
  icons = Icons;
  iconSizes = IconSizes;
  fiatValue: string;
  isWithdrawal = false;
  percentageSelected: string;
  crs: Token;
  vaultAddress: string;
  positionType: 'Balance' | 'ProposalVote';
  subscription = new Subscription();
  balanceError: boolean;
  proposal: VaultProposal;
  latestBlock: number;
  votingDisabled: string;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get inFavor(): FormControl {
    return this.form.get('inFavor') as FormControl;
  }

  constructor(
    protected _injector: Injector,
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    private _env: EnvironmentsService,
    private _tokenService: TokensService
  ) {
    super(_injector);

    this.vaultAddress = this._env.vaultAddress;

    this.form = this._fb.group({
      amount: ['', [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]],
      inFavor: [false, Validators.required]
    });

    this.subscription.add(
        this._tokenService.getToken('CRS')
          .subscribe(crs => this.crs = crs));

    this.subscription.add(
      this.amount.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(_ => this.validateBalance()))
        .subscribe());

    this.subscription.add(
      this._indexService.latestBlock$
        .subscribe(block => this.latestBlock = block.height));
  }

  ngOnChanges() {
    if (!!this.data) {
      const { proposal, withdraw, inFavor } = this.data;

      // this.proposalId.setValue(this.data.proposalId);
      this.inFavor.setValue(!!inFavor);
      this.isWithdrawal = !!withdraw;
      this.positionType = this.isWithdrawal ? 'ProposalVote' : 'Balance';

      if (proposal) this._setProposal(proposal);
    }
  }

  submit(): void {
    if (!this.vaultAddress) return;

    let quote$: Observable<ITransactionQuote>;
    const amount = new FixedDecimal(this.amount.value, 8);

    if (!this.isWithdrawal) {
      const request = new VaultProposalVoteQuoteRequest(amount, this.inFavor.value);
      quote$ = this._platformApi.voteOnVaultProposal(this.vaultAddress, this.proposal.proposalId, request.payload);
    } else {
      const request = new VaultProposalWithdrawVoteQuoteRequest(amount);
      quote$ = this._platformApi.withdrawVaultProposalVote(this.vaultAddress, this.proposal.proposalId, request.payload);
    }

    quote$
      .pipe(take(1))
      .subscribe((quote: ITransactionQuote) => this.quote(quote),
                 (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  handleAddRemoveStatus(event: MatSlideToggleChange): void {
    this.isWithdrawal = event.checked;
    this.positionType = this.isWithdrawal ? 'ProposalVote' : 'Balance';

    this._setProposal(this.proposal);
    this.amount.setValue(undefined);
    this.amount.markAsUntouched();
    this.balanceError = false;
  }

  handlePercentageSelect(value: any): void {
    this.percentageSelected = null;
    this.amount.setValue(value.result, {emitEvent: true});
  }

  private validateBalance(): Observable<boolean> {
    if (!this.amount.value || !this.context?.wallet || !this.crs) return of(false);

    const amountNeeded = new FixedDecimal(this.amount.value, this.crs.decimals);

    const stream$: Observable<boolean> = this.isWithdrawal
      ? this._validateVaultVote$(this.proposal.proposalId, amountNeeded)
      : this._validateBalance$(this.crs, amountNeeded);

    return stream$.pipe(tap(result => this.balanceError = !result));
  }

  private _setProposal(proposal: VaultProposal): void {
    this.proposal = proposal;

    const isNotVotePeriod = proposal.status !== 'Vote';
    const isExpired = proposal.expiration < this.latestBlock;

    if (!this.isWithdrawal && (isNotVotePeriod || isExpired)) {
      this.amount.disable();
      this.votingDisabled = isExpired || proposal.status === 'Complete'
        ? 'Voting period has ended'
        : 'Voting period has not started'
    } else {
      this.amount.enable();
      this.votingDisabled = undefined;
    }
  }

  destroyContext$(): void {
    this.context$.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroyContext$();
    this.subscription.unsubscribe();
  }
}
