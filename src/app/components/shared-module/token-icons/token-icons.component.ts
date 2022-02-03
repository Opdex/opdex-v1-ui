import { Component, Input } from '@angular/core';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';

@Component({
  selector: 'opdex-token-icons',
  templateUrl: './token-icons.component.html',
  styleUrls: ['./token-icons.component.scss']
})
export class TokenIconsComponent {
  @Input() tokens: IToken[];

  get width(): string {
    let width = 0;

    for (let i = 0; i < this.tokens.length; i++) {
      if (i === 0) width = 24;
      else width += 24 - 15; // 24px wide, offset 15px
    }

    return `${width}px`;
  }

  trackBy(index: number, token: IToken): string {
    if (!!token === false) return '';
    return `${index}-${token.address}`;
  }
}
