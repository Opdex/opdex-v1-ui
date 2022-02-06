import { MarketSummary } from '@sharedModels/ui/markets/market-summary';
import { Token } from '@sharedModels/ui/tokens/token';
import { IMarket } from '@sharedModels/platform-api/responses/markets/market.interface';

export class Market {
  private _address: string;
  private _owner: string;
  private _stakingToken: Token;
  private _crsToken: Token;
  private _authPoolCreators: boolean;
  private _authTraders: boolean;
  private _authProviders: boolean;
  private _marketFeeEnabled: boolean;
  private _transactionFeePercent: number;
  private _summary: MarketSummary;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get address(): string {
    return this._address;
  }

  public get owner(): string {
    return this._owner;
  }

  public get stakingToken(): Token {
    return this._stakingToken;
  }

  public get crsToken(): Token {
    return this._crsToken;
  }

  public get authPoolCreators(): boolean {
    return this._authPoolCreators;
  }

  public get authProviders(): boolean {
    return this._authProviders;
  }

  public get authTraders(): boolean {
    return this._authTraders;
  }

  public get marketFeeEnabled(): boolean {
    return this._marketFeeEnabled;
  }

  public get transactionFeePercent(): number {
    return this._transactionFeePercent;
  }

  public get summary(): MarketSummary {
    return this._summary;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  constructor(market: IMarket) {
    this._address = market.address;
    this._owner = market.owner;
    this._stakingToken = new Token(market.stakingToken);
    this._crsToken = new Token(market.crsToken);
    this._authPoolCreators = market.authPoolCreators;
    this._authTraders = market.authTraders;
    this._authProviders = market.authProviders;
    this._marketFeeEnabled = market.marketFeeEnabled;
    this._transactionFeePercent = market.transactionFeePercent;
    this._summary = new MarketSummary(market.summary);

  }
}
