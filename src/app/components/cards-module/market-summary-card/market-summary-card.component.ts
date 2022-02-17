import { Market } from '@sharedModels/ui/markets/market';
import { Component, Input } from '@angular/core';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-market-summary-card',
  templateUrl: './market-summary-card.component.html',
  styleUrls: ['./market-summary-card.component.scss']
})
export class MarketSummaryCardComponent {
  @Input() market: Market;
  icons = Icons;
}
