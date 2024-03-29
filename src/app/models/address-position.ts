import { Token } from '@sharedModels/ui/tokens/token';
import { FixedDecimal } from './types/fixed-decimal';
import { MarketToken } from './ui/tokens/market-token';

export class AddressPosition {
  private _walletAddress: string;
  private _token: Token;
  private _position: string;
  private _amount: FixedDecimal;
  private _value: FixedDecimal;
  private _modifiedBlock: number;

  public get walletAddress(): string {
    return this._walletAddress;
  }

  public get token(): Token {
    return this._token;
  }

  public get position(): string {
    return this._position;
  }

  public get amount(): FixedDecimal {
    return this._amount;
  }

  public get value(): FixedDecimal {
    return this._value;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  public get trackBy(): string {
    const { value, amount, token } = this;
    return `${value.formattedValue}-${amount.formattedValue}-${token.address}`;
  }

  constructor(walletAddress: string, token: Token | MarketToken, position: string, amount: FixedDecimal, modifiedBlock: number) {
    this._walletAddress = walletAddress;
    this._token = token;
    // Balances of OLPT are the users position for providing liquidity
    this._position = position.includes('Balance') && token?.isProvisional ? 'Providing' : position;
    this._amount = amount;
    this._modifiedBlock = modifiedBlock;
    this._value = this._calcValue();
  }

  private _calcValue(): FixedDecimal {
    if (this._token) {
      return this._token.summary.priceUsd.multiply(this._amount);
    }

    return FixedDecimal.Zero(8);
  }
}
