import { TokensService } from '@sharedServices/platform/tokens.service';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { Component, Injector, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { VaultProposalVoteQuoteRequest } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-vote-quote-request.interface';
import { VaultProposalWithdrawVoteQuoteRequest } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-withdraw-vote-quote-request.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-tx-vault-proposal-vote',
  templateUrl: './tx-vault-proposal-vote.component.html',
  styleUrls: ['./tx-vault-proposal-vote.component.scss']
})
export class TxVaultProposalVoteComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data: any;
  form: FormGroup;
  icons = Icons;
  fiatValue: string;
  isWithdrawal = false;
  percentageSelected: string;
  crs: IToken;
  vaultAddress: string;
  positionType: 'Balance' | 'ProposalVote';
  subscription = new Subscription();

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get proposalId(): FormControl {
    return this.form.get('proposalId') as FormControl;
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

    this.vaultAddress = this._env.vaultGovernanceAddress;

    this.form = this._fb.group({
      proposalId: ['', [Validators.required, Validators.min(1)]],
      amount: ['', [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]],
      inFavor: [false, Validators.required]
    });

    this.subscription.add(this._tokenService.getToken('CRS').subscribe(crs => this.crs = crs));
  }

  ngOnChanges() {
    if (!!this.data) {
      this.proposalId.setValue(this.data.proposalId);
      this.isWithdrawal = !!this.data.withdraw;
      this.inFavor.setValue(!!this.data.inFavor);

      this.positionType = this.isWithdrawal ? 'ProposalVote' : 'Balance';
    }
  }

  submit(): void {
    if (!this.vaultAddress) return;

    let quote$: Observable<ITransactionQuote>;

    if (!this.isWithdrawal) {
      const request = new VaultProposalVoteQuoteRequest(new FixedDecimal(this.amount.value, 8), this.inFavor.value);
      quote$ = this._platformApi.voteOnVaultProposal(this.vaultAddress, this.proposalId.value, request.payload);
    }
    else {
      const request = new VaultProposalWithdrawVoteQuoteRequest(new FixedDecimal(this.amount.value, 8));
      quote$ = this._platformApi.withdrawVaultProposalVote(this.vaultAddress, this.proposalId.value, request.payload);
    }

    quote$
      .pipe(take(1))
      .subscribe((quote: ITransactionQuote) => this.quote(quote),
                 (errors: string[]) => this.quoteErrors = errors);
  }

  handleAddRemoveStatus(): void {
    this.isWithdrawal = !this.isWithdrawal;
    this.positionType = this.isWithdrawal ? 'ProposalVote' : 'Balance';
  }

  handlePercentageSelect(value: any): void {
    this.percentageSelected = null;
    this.amount.setValue(value.result, {emitEvent: true});
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
    this.subscription.unsubscribe();
  }
}