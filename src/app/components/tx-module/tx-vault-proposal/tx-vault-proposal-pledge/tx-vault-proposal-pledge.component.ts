import { VaultProposalPledgeQuoteRequest } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-pledge-quote-request.interface';
import { Component, Injector, Input, OnChanges, OnDestroy } from '@angular/core';
import { VaultProposalWithdrawPledgeQuoteRequest } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-widthraw-pledge-quote-request.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';

@Component({
  selector: 'opdex-tx-vault-proposal-pledge',
  templateUrl: './tx-vault-proposal-pledge.component.html',
  styleUrls: ['./tx-vault-proposal-pledge.component.scss']
})
export class TxVaultProposalPledgeComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data;
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

  constructor(
    protected _injector: Injector,
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    private _env: EnvironmentsService
  ) {
    super(_injector);

    this.form = this._fb.group({
      proposalId: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]]
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
      const request = new VaultProposalPledgeQuoteRequest(new FixedDecimal(this.amount.value, 8));
      quote$ = this._platformApi.pledgeToVaultProposal(vault, this.proposalId.value, request.payload);
    }
    else {
      const request = new VaultProposalWithdrawPledgeQuoteRequest(new FixedDecimal(this.amount.value, 8));
      quote$ = this._platformApi.withdrawVaultProposalPledge(vault, this.proposalId.value, request.payload);
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
