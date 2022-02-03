import { Component, Input } from '@angular/core';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';

@Component({
  selector: 'opdex-token-icon',
  templateUrl: './token-icon.component.html',
  styleUrls: ['./token-icon.component.scss']
})
export class TokenIconComponent {
  private readonly _baseUrl = 'https://github.com/trustwallet/assets/blob/master/blockchains';

  @Input() token: IToken;

  public get iconPath(): string {
    const { nativeToken } = this.token;

    if (!!nativeToken === false) return '';

    const { nativeChain, nativeAddress } = nativeToken;

    return !!nativeAddress
      ? `${this._baseUrl}/${nativeChain.toLowerCase()}/assets/${nativeAddress}/logo.png`
      : `${this._baseUrl}/${nativeChain.toLowerCase()}/info/logo.png`;
  }

  handleError() { }
}
