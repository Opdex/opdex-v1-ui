import { MathService } from '@sharedServices/utility/math.service';
import { tap } from 'rxjs/operators';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

@Component({
  selector: 'opdex-percentage-amount-buttons',
  templateUrl: './percentage-amount-buttons.component.html',
  styleUrls: ['./percentage-amount-buttons.component.scss']
})
export class PercentageAmountButtonsComponent implements OnChanges {
  @Input() contract: string; // The Mining/Liquidity/Token where the balance would be checked
  @Input() token: IToken;
  @Input() positionType: 'Balance' | 'Staking' | 'Mining';
  @Input() selected: string;
  @Output() onPercentageSelect = new EventEmitter<any>();

  contextSubscription = new Subscription();
  positionSubscription = new Subscription();
  context: any;
  balance: FixedDecimal;
  percentages: string[] = [ '25', '50', '75', '100' ];

  constructor(
    private _context: UserContextService,
    private _blocksService: BlocksService,
    private _walletService: WalletsService
  ) {
    this.contextSubscription.add(
      this._context.getUserContext$()
        .pipe(tap(context => this.context = context))
        .subscribe(_ => this.ngOnChanges()));
  }

  ngOnChanges(): void {
    if (this.context?.wallet && this.positionType && this.token && this.contract) {
      let balance$: Observable<string>;

      if (this.positionType === 'Balance') {
        balance$ = this._walletService.getBalance(this.context.wallet, this.contract)
          .pipe(map(result => result.balance));
      }
      else if (this.positionType === 'Staking') {
        balance$ = this._walletService.getStakingPosition(this.context.wallet, this.contract)
          .pipe(map(result => result.amount), tap(result => console.log(result)));
      }
      else {
        balance$ = this._walletService.getMiningPosition(this.context.wallet, this.contract)
          .pipe(map(result => result.amount));
      }

      if (this.positionSubscription && !this.positionSubscription.closed) {
        this.positionSubscription.unsubscribe();
        this.positionSubscription = new Subscription();
      }

      this.positionSubscription.add(
        this._blocksService.getLatestBlock$()
          .pipe(switchMap(_ => balance$))
          .subscribe(result => this.balance = new FixedDecimal(result, this.token.decimals)));
    }
  }

  selectPercentage(value: string) {
    if (!this.balance) return;

    const formattedValue = value === '100' ? '1.00' : `0.${value}`;
    const result = MathService.multiply(this.balance, new FixedDecimal(formattedValue, 2));

    this.onPercentageSelect.emit({result, percentageOption: value});
  }

  ngOnDestroy(): void {
    this.contextSubscription.unsubscribe();
    this.positionSubscription.unsubscribe();
  }
}
