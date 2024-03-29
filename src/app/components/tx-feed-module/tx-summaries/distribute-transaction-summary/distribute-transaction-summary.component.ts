import { Icons } from 'src/app/enums/icons';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { IDistributionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/tokens/distribution-event.interface';
import { TransactionReceipt } from '@sharedModels/ui/transactions/transaction-receipt';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { take } from 'rxjs/operators';
import { Token } from '@sharedModels/ui/tokens/token';

@Component({
  selector: 'opdex-distribute-transaction-summary',
  templateUrl: './distribute-transaction-summary.component.html',
  styleUrls: ['./distribute-transaction-summary.component.scss']
})
export class DistributeTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  icons = Icons;
  iconSizes = IconSizes;
  miningGovernanceAmount: FixedDecimal;
  vaultAmount: FixedDecimal;
  token: Token;
  subscription = new Subscription();
  error: string;
  eventTypes = [
    TransactionEventTypes.DistributionEvent
  ]

  constructor(private _tokenService: TokensService) { }

  ngOnChanges(): void {
    const events = this.transaction.events.filter(event => this.eventTypes.includes(event.eventType)) as IDistributionEvent[];

    if (events.length !== 1) {
      this.error = 'Unable to read distribution transaction.';
      return;
    }

    const event = events[0];

    this.subscription.unsubscribe();
    this.subscription = new Subscription();

    this.subscription.add(
      this._tokenService.getToken(event.contract)
        .pipe(take(1))
        .subscribe(token => {
          this.token = token;
          this.miningGovernanceAmount = new FixedDecimal(event.miningGovernanceAmount, this.token.decimals);
          this.vaultAmount = new FixedDecimal(event.vaultAmount, this.token.decimals);
        }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
