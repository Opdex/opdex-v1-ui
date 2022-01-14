import { MinimumPledgeVaultProposalQuoteRequest } from '@sharedModels/platform-api/requests/vaults/minimum-pledge-vault-proposal-quote-request.interface';
import { CreateCertificateVaultProposalQuoteRequest } from '@sharedModels/platform-api/requests/vaults/create-certificate-vault-proposal-quote-request.interface';
import { RevokeCertificateVaultProposalQuoteRequest } from '@sharedModels/platform-api/requests/vaults/revoke-certificate-vault-proposal-quote-request.interface';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { OnDestroy } from '@angular/core';
import { Component, Injector, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MinimumVoteVaultProposalQuoteRequest } from '@sharedModels/platform-api/requests/vaults/minimum-vote-vault-proposal-quote-request.interface';

@Component({
  selector: 'opdex-tx-vault-proposal-create',
  templateUrl: './tx-vault-proposal-create.component.html',
  styleUrls: ['./tx-vault-proposal-create.component.scss']
})
export class TxVaultProposalCreateComponent extends TxBase implements OnDestroy {
  @Input() data;
  form: FormGroup;
  icons = Icons;
  fiatValue: string;
  proposalTypes = [
    {
      label: 'Create Certificate',
      value: 1
    },
    {
      label: 'Revoke Certificate',
      value: 2
    },
    {
      label: 'Minimum Pledge',
      value: 3
    },
    {
      label: 'Minimum Vote',
      value: 4
    }
  ];

  get deposit(): FormControl {
    return this.form.get('deposit') as FormControl;
  }

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get recipient(): FormControl {
    return this.form.get('recipient') as FormControl;
  }

  constructor(
    protected _injector: Injector,
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    private _env: EnvironmentsService
  ) {
    super(_injector);

    this.form = this._fb.group({
      type: [1, [Validators.required]],
      deposit: [{value: '500', disabled: true}, [Validators.required]],
      description: ['', [Validators.required]],
      amount: ['', [Validators.pattern(PositiveDecimalNumberRegex)]],
      recipient: ['']
    });
  }

  submit(): void {
    const vault = this._env.vaultAddress;
    if (!vault) return;

    let quote$: Observable<ITransactionQuote>;

    if (this.type.value === 1) {
      const amount = new FixedDecimal(this.amount.value, 8);

      if (amount.bigInt > new FixedDecimal('5000000', 8).bigInt) {
        this.quoteErrors = ['Maximum amount is 5 million.'];
        return;
      }

      const request = new CreateCertificateVaultProposalQuoteRequest(this.recipient.value, new FixedDecimal(this.amount.value, 8), this.description.value);
      quote$ = this._platformApi.createCertificateVaultProposal(vault, request.payload);
    }
    else if (this.type.value === 2) {
      const request = new RevokeCertificateVaultProposalQuoteRequest(this.recipient.value, this.description.value);
      quote$ = this._platformApi.revokeCertificateVaultProposal(vault, request.payload);
    }
    else if (this.type.value === 3) {
      // Todo: CRS decimals
      const request = new MinimumPledgeVaultProposalQuoteRequest(new FixedDecimal(this.amount.value, 8), this.description.value);
      quote$ = this._platformApi.minimumPledgeVaultProposal(vault, request.payload);
    }
    else if (this.type.value === 4) {
      const request = new MinimumVoteVaultProposalQuoteRequest(new FixedDecimal(this.amount.value, 8), this.description.value);
      quote$ = this._platformApi.minimumVoteVaultProposal(vault, request.payload);
    }
    else {
      // Error
      return;
    }

    quote$
      .pipe(take(1))
      .subscribe((quote: ITransactionQuote) => this.quote(quote),
                 (errors: string[]) => this.quoteErrors = errors);
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
  }
}
