import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { VaultProposalVoteQuoteRequest } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-vote-quote-request.interface';
import { VaultProposalWithdrawVoteQuoteRequest } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-widthraw-vote-quote-request.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-tx-vault-proposal-vote',
  templateUrl: './tx-vault-proposal-vote.component.html',
  styleUrls: ['./tx-vault-proposal-vote.component.scss']
})
export class TxVaultProposalVoteComponent extends TxBase implements OnDestroy {
  @Input() data;
  form: FormGroup;
  icons = Icons;
  fiatValue: string;
  types = [
    {
      label: 'Add',
      value: 1
    },
    {
      label: 'Withdraw',
      value: 2
    }
  ];

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
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
    private _blocksService: BlocksService,
    private _env: EnvironmentsService
  ) {
    super(_injector);

    this.form = this._fb.group({
      type: [1, [Validators.required]],
      proposalId: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      inFavor: [false, Validators.required]
    });
  }

  submit(): void {
    const vault = this._env.vaultGovernanceAddress;
    if (!vault) return;

    let quote$: Observable<ITransactionQuote>;

    if (this.type.value === 1) {
      const request = new VaultProposalVoteQuoteRequest(new FixedDecimal(this.amount.value, 8), this.inFavor.value);
      quote$ = this._platformApi.voteOnVaultProposal(vault, this.proposalId.value, request.payload);
    }
    else if (this.type.value === 2) {
      const request = new VaultProposalWithdrawVoteQuoteRequest(new FixedDecimal(this.amount.value, 8));
      quote$ = this._platformApi.withdrawVaultProposalVote(vault, this.proposalId.value, request.payload);
    }
    else {
      // Error
      return;
    }

    quote$
      .pipe(take(1))
      .subscribe((quote: ITransactionQuote) => this.quote(quote));
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
  }
}
