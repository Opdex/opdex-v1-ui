import { Token } from '@sharedModels/ui/tokens/token';
import { FixedDecimal } from './types/fixed-decimal';

export class AddressPosition {
  private _walletAddress: string;
  private _token: Token;
  private _position: 'Staking' | 'Mining' | 'Balance' | 'Providing';
  private _amount: FixedDecimal;
  private _value: FixedDecimal;

  public get walletAddress(): string {
    return this._walletAddress;
  }

  public get token(): Token {
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

  constructor(walletAddress: string, token: Token, position: 'Staking' | 'Mining' | 'Balance', amount: FixedDecimal) {
    this._walletAddress = walletAddress;
    this._token = token;
    // Balances of OLPT are the users position for providing liquidity
    this._position = position === 'Balance' && token?.symbol === 'OLPT' ? 'Providing' : position;
    this._amount = amount;
    this._value = this.calcValue();
  }

  private calcValue(): FixedDecimal {
    const valueDecimals = 8;
    let result = FixedDecimal.Zero(valueDecimals);

    if (this._token) {
      const price = new FixedDecimal(this._token.summary.priceUsd.toString(), valueDecimals);

      result = price.multiply(this._amount);
    }

    return result;
  }
}
