import { TokenHistory } from './token-history';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { TokenSummary } from '@sharedModels/ui/tokens/token-summary';
import { WrappedToken } from '@sharedModels/ui/tokens/wrapped-token';

export class Token {
  private _address: string;
  private _name: string;
  private _symbol: string;
  private _decimals: number;
  private _sats: number;
  private _totalSupply: FixedDecimal;
  private _summary: TokenSummary;
  private _attributes: string[];
  private _wrappedToken: WrappedToken;
  private _createdBlock: number;
  private _modifiedBlock: number;
  private _balance?: any;
  private _history?: TokenHistory;

  public get address(): string {
    return this._address;
  }

  public get name(): string {
    return this._name;
  }

  public get symbol(): string {
    return this._symbol;
  }

  public get decimals(): number {
    return this._decimals;
  }

  public get sats(): number {
    return this._sats;
  }

  public get totalSupply(): FixedDecimal {
    return this._totalSupply;
  }

  public get summary(): TokenSummary {
    return this._summary;
  }

  public get attributes(): string[] {
    return this._attributes;
  }

  public get wrappedToken(): WrappedToken {
    return this._wrappedToken;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  public get balance(): any {
    return this._balance;
  }

  public get history(): TokenHistory {
    return this._history;
  }

  constructor(token: IToken) {
    if (!!token === false) return;

    this._address = token.address;
    this._name = token.name;
    this._symbol = token.symbol;
    this._decimals = token.decimals;
    this._sats = token.sats;
    this._totalSupply = new FixedDecimal(token.totalSupply, token.decimals);
    this._summary = new TokenSummary(token.summary);
    this._attributes = [...token.attributes];
    this._wrappedToken = !!token.wrappedToken ? new WrappedToken(token.wrappedToken) : null;
    this._createdBlock = token.createdBlock;
    this._modifiedBlock = token.modifiedBlock;
  }

  public setBalance(balance: any) {
    this._balance = balance;
  }

  public setHistory(history: TokenHistory) {
    this._history = history;
  }
}
