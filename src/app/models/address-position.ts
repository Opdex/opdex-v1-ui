import { FixedDecimal } from './types/fixed-decimal';
import { IToken } from "./platform-api/responses/tokens/token.interface";
import { MathService } from '@sharedServices/utility/math.service';

export class AddressPosition {
  private _walletAddress: string;
  private _token: IToken;
  private _position: 'Staking' | 'Mining' | 'Balance' | 'Providing';
  private _amount: FixedDecimal;
  private _value: FixedDecimal;

  public get walletAddress(): string {
    return this._walletAddress;
  }

  public get token(): IToken {
    return this._token;
  }

  public get position(): 'Staking' | 'Mining' | 'Balance' | 'Providing' {
    return this._position;
  }

  public get amount(): FixedDecimal {
    return this._amount;
  }

  public get value(): FixedDecimal {
    return this._value;
  }

  constructor(walletAddress: string, token: IToken, position: 'Staking' | 'Mining' | 'Balance', amount: FixedDecimal) {
    this._walletAddress = walletAddress;
    this._token = token;
    // Balances of OLPT are the users position for providing liquidity
    this._position = position === 'Balance' && token?.symbol === 'OLPT' ? 'Providing' : position;
    this._amount = amount;
    this._value = this.calcValue();
  }

  private calcValue(): FixedDecimal {
    const valueDecimals = 8;
    let result = '0';

    if (this._token) {
      result = MathService.multiply(
        new FixedDecimal(this._token.summary.priceUsd.toString(), valueDecimals),
        new FixedDecimal(this._amount.formattedValue, this._token.decimals));
    }

    return new FixedDecimal(result, valueDecimals);
  }
}
