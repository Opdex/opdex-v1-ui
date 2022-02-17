import { MarketTokenGroup } from './market-token-group';
import { MarketSummary } from '@sharedModels/ui/markets/market-summary';
import { IMarket } from '@sharedModels/platform-api/responses/markets/market.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

export class Market {
  private _address: string;
  private _owner: string;
  private _tokens: MarketTokenGroup;
  private _authPoolCreators: boolean;
  private _authTraders: boolean;
  private _authProviders: boolean;
  private _marketFeeEnabled: boolean;
  private _transactionFeePercent: FixedDecimal;
  private _summary: MarketSummary;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get address(): string {
    return this._address;
  }

  public get owner(): string {
    return this._owner;
  }

  public get tokens(): MarketTokenGroup {
    return this._tokens;
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

  public get transactionFeePercent(): FixedDecimal {
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

  public get isStaking(): boolean {
    return !!this._tokens.staking;
  }

  public get isPublic(): boolean {
    return this.isStaking || (!this.authPoolCreators && !this.authProviders && !this.authTraders);
  }

  constructor(market: IMarket) {
    this._address = market.address;
    this._owner = market.owner;
    this._tokens = new MarketTokenGroup(market.tokens);
    this._authPoolCreators = market.authPoolCreators;
    this._authTraders = market.authTraders;
    this._authProviders = market.authProviders;
    this._marketFeeEnabled = market.marketFeeEnabled;
    this._transactionFeePercent = new FixedDecimal(market.transactionFeePercent, 3);
    this._summary = new MarketSummary(market.summary);
    this._createdBlock = market.createdBlock;
    this._modifiedBlock = market.modifiedBlock;
  }
}
