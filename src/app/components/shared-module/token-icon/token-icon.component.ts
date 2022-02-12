import { Component, Input } from '@angular/core';
import { Token } from '@sharedModels/ui/tokens/token';

@Component({
  selector: 'opdex-token-icon',
  templateUrl: './token-icon.component.html',
  styleUrls: ['./token-icon.component.scss']
})
export class TokenIconComponent {
  private readonly _baseUrl = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains';

  @Input() token: Token;

  public get iconPath(): string {
    if (!this.token) return '';

    let { wrappedToken } = this.token;

    if (!!wrappedToken === false) return '';

    const { chain, address } = wrappedToken;

    return !!address
      ? `${this._baseUrl}/${chain.toLowerCase()}/assets/${address}/logo.png`
      : `${this._baseUrl}/${chain.toLowerCase()}/info/logo.png`;
  }
}
