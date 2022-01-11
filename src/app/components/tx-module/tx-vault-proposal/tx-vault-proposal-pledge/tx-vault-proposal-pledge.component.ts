import { TokensService } from '@sharedServices/platform/tokens.service';
import { Component, Injector, Input, OnChanges, OnDestroy } from '@angular/core';
import { VaultProposalWithdrawPledgeQuoteRequest } from '@sharedModels/platform-api/requests/vaults/vault-proposal-withdraw-pledge-quote-request.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, take, tap } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { VaultProposalPledgeQuoteRequest } from '@sharedModels/platform-api/requests/vaults/vault-proposal-pledge-quote-request.interface';
import { IconSizes } from 'src/app/enums/icon-sizes';

@Component({
  selector: 'opdex-tx-vault-proposal-pledge',
  templateUrl: './tx-vault-proposal-pledge.component.html',
  styleUrls: ['./tx-vault-proposal-pledge.component.scss']
})
export class TxVaultProposalPledgeComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data;
  form: FormGroup;
  icons = Icons;
  iconSizes = IconSizes;
  fiatValue: string;
  isWithdrawal = false;
  percentageSelected: string;
  crs: IToken;
  vaultAddress: string;
  positionType: 'Balance' | 'ProposalPledge';
  subscription = new Subscription();
  balanceError: boolean;

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
    private _env: EnvironmentsService,
    private _tokenService: TokensService
  ) {
    super(_injector);

    this.vaultAddress = this._env.vaultAddress;

    this.form = this._fb.group({
      proposalId: ['', [Validators.required, Validators.min(1)]],
      amount: ['', [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]]
    });

    this.subscription.add(this._tokenService.getToken('CRS').subscribe(crs => this.crs = crs));

    this.subscription.add(
      this.amount.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(_ => this.validateBalance()))
        .subscribe());
  }

  ngOnChanges() {
    if (!!this.data) {
      this.proposalId.setValue(this.data.proposalId);
      this.isWithdrawal = !!this.data.withdraw;

      this.positionType = this.isWithdrawal ? 'ProposalPledge' : 'Balance';
    }
  }

  submit(): void {
    if (!this.vaultAddress) return;

    let quote$: Observable<ITransactionQuote>;

    if (!this.isWithdrawal) {
      const request = new VaultProposalPledgeQuoteRequest(new FixedDecimal(this.amount.value, 8));
      quote$ = this._platformApi.pledgeToVaultProposal(this.vaultAddress, this.proposalId.value, request.payload);
    }
    else {
      const request = new VaultProposalWithdrawPledgeQuoteRequest(new FixedDecimal(this.amount.value, 8));
      quote$ = this._platformApi.withdrawVaultProposalPledge(this.vaultAddress, this.proposalId.value, request.payload);
    }

    quote$
      .pipe(take(1))
      .subscribe((quote: ITransactionQuote) => this.quote(quote),
                 (errors: string[]) => this.quoteErrors = errors);
  }

  handleAddRemoveStatus(): void {
    this.isWithdrawal = !this.isWithdrawal;
    this.positionType = this.isWithdrawal ? 'ProposalPledge' : 'Balance';
  }

  handlePercentageSelect(value: any): void {
    this.percentageSelected = null;
    this.amount.setValue(value.result, {emitEvent: true});
  }

  private validateBalance(): Observable<boolean> {
    if (!this.amount.value || !this.context?.wallet || !this.crs) return of(false);

    const amountNeeded = new FixedDecimal(this.amount.value, this.crs.decimals);

    const stream$: Observable<boolean> = this.isWithdrawal
      ? this._validateVaultPledge$(this.proposalId.value, amountNeeded)
      : this._validateBalance$(this.crs, amountNeeded);

    return stream$.pipe(tap(result => this.balanceError = !result));
  }

  destroyContext$(): void {
    this.context$.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroyContext$();
    this.subscription.unsubscribe();
  }
}
