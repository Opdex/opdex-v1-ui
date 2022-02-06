import { Token } from '@sharedModels/ui/tokens/token';
import { Component, Input } from '@angular/core';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-market-token-card',
  templateUrl: './market-token-card.component.html',
  styleUrls: ['./market-token-card.component.scss']
})
export class MarketTokenCardComponent {
  @Input() token: Token;
  @Input() icon: Icons;
  @Input() iconColor: string;
}
