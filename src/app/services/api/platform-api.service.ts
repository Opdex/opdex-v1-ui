import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { RestApiService } from './rest-api.service';
import { ErrorService } from '@sharedServices/utility/error.service';
import { Observable } from 'rxjs';
import { ILiquidityPoolSnapshotHistoryResponse, ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';

@Injectable({
  providedIn: 'root'
})
export class PlatformApiService extends RestApiService {
  private api: string;

  constructor(
    protected _http: HttpClient,
    protected _error: ErrorService
  ) {
    super(_http, _error);
    this.api = environment.api;
  }

  //////////////
  // Auth
  //////////////

  public auth(market: string, wallet: string): Observable<string> {
    return this.post(`${this.api}/auth/authorize?wallet=${wallet}&market=${market}`, {}, { responseType: 'text' });
  }

  //////////////
  // Indexer
  //////////////

  public processLatestBlocks(): Observable<any> {
    return this.post(`${this.api}/index/process-latest-blocks`, {});
  }

  //////////////
  // Tokens
  //////////////

  public getToken(address: string): Observable<any> {
    return this.get<any>(`${this.api}/tokens/${address}`);
  }

  public getTokens(): Observable<any[]> {
    return this.get<any[]>(`${this.api}/tokens`);
  }

  //////////////
  // Pools
  //////////////

  public getPool(address: string): Observable<ILiquidityPoolSummaryResponse> {
    return this.get<any>(`${this.api}/pools/${address}`);
  }

  public getPools(): Observable<ILiquidityPoolSummaryResponse[]> {
    return this.get<any[]>(`${this.api}/pools`);
  }

  public getPoolTransactions(address: string): Observable<any[]> {
    return this.get<any>(`${this.api}/pools/${address}/transactions`);
  }

  public getPoolHistory(address: string): Observable<ILiquidityPoolSnapshotHistoryResponse> {
    return this.get<ILiquidityPoolSnapshotHistoryResponse>(`${this.api}/pools/${address}/history`);
  }

  //////////////
  // Markets
  //////////////

  public getMarketOverview(): Observable<any> {
    return this.get<any>(`${this.api}/market`);
  }

  public getMarketHistory(): Observable<any> {
    return this.get<any>(`${this.api}/market/history`);
  }

  //////////////
  // Pools
  //////////////

  public quoteAddLiquidity(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/quote/add-liquidity`, payload);
  }

  public getSwapQuote(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/quote/swap`, payload);
  }

  ////////////////////////////////////////////////////////
  // Wallet Transactions - Temporary Local ENV only
  ////////////////////////////////////////////////////////
  public swap(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/swap`, payload);
  }

  // Create Liquidity Pool
  public createPool(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/create-pool`, payload);
  }

  // Liquidity Providing
  public addLiquidity(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/add-liquidity`, payload);
  }

  public removeLiquidity(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/remove-liquidity`, payload);
  }

  // Allowance
  public approveAllowance(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/approve-allowance`, payload);
  }

  // Mining
  public startMining(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/start-mining`, payload);
  }

  public stopMining(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/stop-mining`, payload);
  }

  public collectMiningRewards(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/collect-mining-rewards`, payload);
  }

  // Staking
  public startStaking(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/start-staking`, payload);
  }

  public stopStaking(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/stop-staking`, payload);
  }

  public collectStakingRewards(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/collect-staking-rewards`, payload);
  }

  // Balances

  public getWalletSummaryForPool(pool: string, wallet: string): Observable<any> {
    return this.get<any>(`${this.api}/wallet/summary/pool/${pool}?walletAddress=${wallet}`);
  }
}






