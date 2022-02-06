import { Token } from '@sharedModels/ui/tokens/token';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { IApprovalEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/tokens/approve-event.interface';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { Subscription } from 'rxjs';
import { Icons } from 'src/app/enums/icons';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { take } from 'rxjs/operators';

@Component({
  selector: 'opdex-allowance-transaction-summary',
  templateUrl: './allowance-transaction-summary.component.html',
  styleUrls: ['./allowance-transaction-summary.component.scss']
})
export class AllowanceTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  icons = Icons;
  iconSizes = IconSizes;
  token: Token;
  amount: FixedDecimal;
  to: string;
  subscription = new Subscription();
  error: string;
  eventTypes = [
    TransactionEventTypes.ApprovalEvent,
  ]

  constructor(private _tokenService: TokensService) { }

  ngOnChanges(): void {
    const approveEvents = this.transaction.events.filter(event => this.eventTypes.includes(event.eventType)) as IApprovalEvent[];

    if (approveEvents[0] === undefined) {
      this.error = 'Unable to read approve allowance transaction.';
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = new Subscription();

    this.subscription.add(
      this._tokenService.getToken(approveEvents[0].contract)
        .pipe(take(1))
        .subscribe(
          (token: Token) => {
            this.token = token;
            this.amount = new FixedDecimal(approveEvents[0].amount, this.token.decimals);
            this.to = approveEvents[0].spender;
          },
          (error: string) => this.error = 'Unable to read approve allowance transaction.'));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
