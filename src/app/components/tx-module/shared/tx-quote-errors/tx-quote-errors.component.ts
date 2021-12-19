import { Component, Input } from '@angular/core';

@Component({
  selector: 'opdex-tx-quote-errors',
  templateUrl: './tx-quote-errors.component.html',
  styleUrls: ['./tx-quote-errors.component.scss']
})
export class TxQuoteErrorsComponent {
  @Input() quoteErrors: string[];
}
