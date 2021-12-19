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
import { Observable } from 'rxjs';
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
    private _env: EnvironmentsService
  ) {
    super(_injector);

    this.form = this._fb.group({
      proposalId: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]],
      inFavor: [false, Validators.required]
    });
  }

  ngOnChanges() {
    if (!!this.data) {
      this.proposalId.setValue(this.data.proposalId);
      this.isWithdrawal = !!this.data.withdraw;
    }
  }

  submit(): void {
    const vault = this._env.vaultGovernanceAddress;
    if (!vault) return;

    let quote$: Observable<ITransactionQuote>;

    if (!this.isWithdrawal) {
      const request = new VaultProposalVoteQuoteRequest(new FixedDecimal(this.amount.value, 8), this.inFavor.value);
      quote$ = this._platformApi.voteOnVaultProposal(vault, this.proposalId.value, request.payload);
    }
    else {
      const request = new VaultProposalWithdrawVoteQuoteRequest(new FixedDecimal(this.amount.value, 8));
      quote$ = this._platformApi.withdrawVaultProposalVote(vault, this.proposalId.value, request.payload);
    }

    quote$
      .pipe(take(1))
      .subscribe((quote: ITransactionQuote) => this.quote(quote));
  }

  handleAddRemoveStatus(): void {
    this.isWithdrawal = !this.isWithdrawal;
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
  }
}
