import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { Component, Input } from '@angular/core';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-liquidity-pool-token-card',
  templateUrl: './liquidity-pool-token-card.component.html',
  styleUrls: ['./liquidity-pool-token-card.component.scss']
})
export class LiquidityPoolTokenCardComponent {
  @Input() token: IToken;
  @Input() reserves: string;
  @Input() swapRate: string | number;
  @Input() swapToken: IToken;
  icons = Icons;
}
