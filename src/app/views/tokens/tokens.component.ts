import { Component } from '@angular/core';
import { TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';

@Component({
  selector: 'opdex-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {
  filter: TokensFilter;

  constructor() {
    this.filter = new TokensFilter({
      orderBy: 'DailyPriceChangePercent',
      direction: 'DESC',
      limit: 10,
      provisional: 'NonProvisional'
    });
  }
}
