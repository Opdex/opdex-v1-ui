import { Router } from '@angular/router';
import { JwtService } from './../utility/jwt.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { RestApiService } from './rest-api.service';
import { ErrorService } from '@sharedServices/utility/error.service';
import { Observable } from 'rxjs';
import { ILiquidityPoolSnapshotHistoryResponse, ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { LiquidityPoolsSearchQuery } from '@sharedModels/requests/liquidity-pool-filter';
import { TransactionRequest } from '@sharedModels/requests/transactions-filter';
import { ITransactionResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { ITransactionsResponse } from '@sharedModels/responses/platform-api/Transactions/transactions-response';
import { IAddressAllowanceResponse } from '@sharedModels/responses/platform-api/Addresses/address-allowance.interface';

@Injectable({
  providedIn: 'root'
})
export class PlatformApiService extends RestApiService {
  private api: string;

  constructor(
    protected _http: HttpClient,
    protected _error: ErrorService,
    protected _jwt: JwtService,
    protected _router: Router,
  ) {
    super(_http, _error, _jwt, _router);
    this.api = environment.api;
  }

  //////////////
  // Auth
  //////////////

  public auth(market: string, wallet: string): Observable<string> {
    let walletParam = '&wallet='
    if (wallet) {
      walletParam = `${walletParam}${wallet}`;
    }

    return this.post(`${this.api}/auth/authorize?market=${market}${walletParam}`, {}, { responseType: 'text' });
  }

  //////////////
  // Indexer
  //////////////

  public getLatestSyncedBlock(): Observable<any> {
    return this.get<any>(`${this.api}/index/latest-block`);
  }

  //////////////
  // Tokens
  //////////////

  public getToken(address: string): Observable<any> {
    return this.get<any>(`${this.api}/tokens/${address}`);
  }

  public getTokenHistory(address: string, timeSpan: string = '1y', candleSpan: string = 'Hourly'): Observable<any> {
    return this.get<any>(`${this.api}/tokens/${address}/history?timeSpan=${timeSpan}&candleSpan=${candleSpan}`);
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

  public getPools(query?: LiquidityPoolsSearchQuery): Observable<ILiquidityPoolSummaryResponse[]> {
    return this.get<any[]>(`${this.api}/pools${query?.getQuery() || ''}`);
  }

  public getPoolTransactions(address: string): Observable<any[]> {
    return this.get<any>(`${this.api}/pools/${address}/transactions`);
  }

  public getPoolHistory(address: string): Observable<ILiquidityPoolSnapshotHistoryResponse> {
    return this.get<ILiquidityPoolSnapshotHistoryResponse>(`${this.api}/pools/${address}/history?timeSpan=1Y&candleSpan=Hourly`);
  }

  //////////////
  // Governances
  //////////////

  public getGovernance(address: string): Observable<any> {
    return this.get<any>(`${this.api}/governances/${address}`);
  }

  public rewardMiningPools(address: string): Observable<any> {
    return this.post<any>(`${this.api}/governances/${address}/reward-mining-pools`, {});
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

  public getSwapQuote(payload: any): Observable<string> {
    return this.post<string>(`${this.api}/quote/swap`, payload, { responseType: 'text' });
  }

  ////////////////////////////
  // Transactions
  ////////////////////////////

  public getTransactions(request: TransactionRequest): Observable<ITransactionsResponse> {
    return this.get<any>(`${this.api}/transactions${request.buildQueryString()}`);
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

  // Distribute tokens
  public distributeTokens(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/build-transaction/local-broadcast/distribute-odx`, payload);
  }

  // Balances

  public getWalletSummaryForPool(pool: string, wallet: string): Observable<any> {
    return this.get<any>(`${this.api}/wallet/summary/pool/${pool}?walletAddress=${wallet}`);
  }

  public getApprovedAllowance(owner: string, spender: string, token: string): Observable<any> {
    return this.get<any>(`${this.api}/wallet/${owner}/allowance/approved?token=${token}&spender=${spender}`);
  }

  public getAllowance(owner: string, spender: string, token: string): Observable<IAddressAllowanceResponse> {
    return this.get<any>(`${this.api}/wallet/${owner}/allowance/${token}/approved/${spender}`);
  }
}






