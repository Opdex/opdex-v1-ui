import { IAddressMiningPositions } from './../../models/responses/platform-api/wallets/address-mining.interface';
import { IBlock } from '@sharedModels/responses/platform-api/blocks/block.interface';
import { IAddressMining } from '@sharedModels/responses/platform-api/wallets/address-mining.interface';
import { IAddressStaking, IAddressStakingPositions } from '@sharedModels/responses/platform-api/wallets/address-staking.interface';
import { ITransactionBroadcast } from '@sharedModels/responses/platform-api/transactions/transaction-broadcast.interface';
import { IMarketSnapshot } from '@sharedModels/responses/platform-api/markets/market-snapshot.interface';
import { IMarket } from '@sharedModels/responses/platform-api/markets/market.interface';
import { IGovernance, IGovernances } from '@sharedModels/responses/platform-api/governances/governance.interface';
import { IAddressBalance, IAddressBalances } from '@sharedModels/responses/platform-api/wallets/address-balance.interface';
import { Router } from '@angular/router';
import { JwtService } from '@sharedServices/utility/jwt.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { RestApiService } from './rest-api.service';
import { ErrorService } from '@sharedServices/utility/error.service';
import { Observable } from 'rxjs';
import { ILiquidityPoolSnapshotHistory, ILiquidityPoolSummary, IMiningPool } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { LiquidityPoolsSearchQuery } from '@sharedModels/requests/liquidity-pool-filter';
import { TransactionRequest } from '@sharedModels/requests/transactions-filter';
import { ITransactionReceipt, ITransactionReceipts } from '@sharedModels/responses/platform-api/transactions/transaction.interface';
import { IAddressAllowanceResponse } from '@sharedModels/responses/platform-api/wallets/address-allowance.interface';
import { IToken } from '@sharedModels/responses/platform-api/tokens/token.interface';
import { IVaultCertificates } from '@sharedModels/responses/platform-api/vaults/vault-certificate.interface';
import { IMiningQuote } from '@sharedModels/requests/mining-quote';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';
import { IMiningPools } from '@sharedModels/responses/platform-api/mining-pools/mining-pool.interface';
import { IVaults, IVault } from '@sharedModels/responses/platform-api/vaults/vault.interface';

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
    this.api = environment.apiUrl;
  }

  ////////////////////////////
  // Auth
  ////////////////////////////

  public auth(market: string, wallet: string): Observable<string> {
    let walletParam = '&wallet='
    if (wallet) {
      walletParam = `${walletParam}${wallet}`;
    }

    return this.post(`${this.api}/auth/authorize?market=${market}${walletParam}`, {}, { responseType: 'text' });
  }

  ////////////////////////////
  // Indexer
  ////////////////////////////

  public getLatestSyncedBlock(): Observable<IBlock> {
    return this.get<IBlock>(`${this.api}/index/latest-block`);
  }

  ////////////////////////////
  // Tokens
  ////////////////////////////

  public getTokens(limit: number = 10, includeLpt: boolean = false): Observable<any[]> {
    return this.get<any[]>(`${this.api}/tokens?take=${limit}&lpToken=${includeLpt}`);
  }

  public getToken(address: string): Observable<IToken> {
    return this.get<IToken>(`${this.api}/tokens/${address}`);
  }

  public getTokenHistory(address: string, timeSpan: string = '1Y', candleSpan: string = 'Hourly'): Observable<any> {
    return this.get<any>(`${this.api}/tokens/${address}/history?timeSpan=${timeSpan}&candleSpan=${candleSpan}`);
  }

  public approveAllowanceQuote(address: string, payload: any): Observable<any> {
    return this.post<any>(`${this.api}/tokens/${address}/approve`, payload);
  }

  public distributeTokensQuote(address: string): Observable<any> {
    return this.post<any>(`${this.api}/tokens/${address}/distribute`, {});
  }

  public swapQuote(address: string, payload: any): Observable<any> {
    return this.post<any>(`${this.api}/tokens/${address}/swap`, payload);
  }

  ////////////////////////////
  // Liquidity Pools
  ////////////////////////////

  public createLiquidityPool(payload: any): Observable<ITransactionQuote> {
    return this.post<ITransactionQuote>(`${this.api}/liquidity-pools`, payload);
  }

  public getPool(address: string): Observable<ILiquidityPoolSummary> {
    return this.get<ILiquidityPoolSummary>(`${this.api}/liquidity-pools/${address}`);
  }

  public getPools(query?: LiquidityPoolsSearchQuery): Observable<ILiquidityPoolSummary[]> {
    return this.get<ILiquidityPoolSummary[]>(`${this.api}/liquidity-pools${query?.getQuery() || ''}`);
  }

  public getPoolHistory(address: string, timeSpan: string = '1Y'): Observable<ILiquidityPoolSnapshotHistory> {
    return this.get<ILiquidityPoolSnapshotHistory>(`${this.api}/liquidity-pools/${address}/history?timeSpan=${timeSpan}&candleSpan=Hourly`);
  }

  public startStakingQuote(address: string, payload: any): Observable<ITransactionQuote> {
    return this.post<ITransactionQuote>(`${this.api}/liquidity-pools/${address}/staking/start`, payload);
  }

  public stopStakingQuote(address: string, payload: any): Observable<ITransactionQuote> {
    return this.post<ITransactionQuote>(`${this.api}/liquidity-pools/${address}/staking/stop`, payload);
  }

  public collectStakingRewardsQuote(address: string, payload: any): Observable<ITransactionQuote> {
    return this.post<ITransactionQuote>(`${this.api}/liquidity-pools/${address}/staking/collect`, payload);
  }

  public addLiquidityQuote(address: string, payload: any): Observable<ITransactionQuote> {
    return this.post<ITransactionQuote>(`${this.api}/liquidity-pools/${address}/add`, payload);
  }

  public removeLiquidityQuote(address: string, payload: any): Observable<ITransactionQuote> {
    return this.post<ITransactionQuote>(`${this.api}/liquidity-pools/${address}/remove`, payload);
  }

  public quoteAddLiquidity(payload: any): Observable<any> {
    return this.post<any>(`${this.api}/quote/add-liquidity`, payload);
  }

  public getSwapQuote(payload: any): Observable<string> {
    return this.post<string>(`${this.api}/quote/swap`, payload);
  }

  ////////////////////////////
  // Mining Pools
  ////////////////////////////

  public getMiningPools(query?: any): Observable<IMiningPools> {
    return this.get<IMiningPools>(`${this.api}/mining-pools${query?.getQuery() || ''}`);
  }

  public getMiningPool(address: string): Observable<IMiningPool> {
    return this.get<IMiningPool>(`${this.api}/mining-pools/${address}`);
  }

  public startMiningQuote(address: string, payload: IMiningQuote): Observable<ITransactionQuote> {
    return this.post<ITransactionQuote>(`${this.api}/mining-pools/${address}/start`, payload);
  }

  public stopMiningQuote(address: string, payload: IMiningQuote): Observable<ITransactionQuote> {
    return this.post<ITransactionQuote>(`${this.api}/mining-pools/${address}/stop`, payload);
  }

  public collectMiningRewardsQuote(address: string): Observable<ITransactionQuote> {
    return this.post<ITransactionQuote>(`${this.api}/mining-pools/${address}/collect`, {});
  }

  ////////////////////////////
  // Governances
  ////////////////////////////

  public getGovernances(): Observable<IGovernances> {
    return this.get<IGovernances>(`${this.api}/governances`);
  }

  public getGovernance(address: string): Observable<IGovernance> {
    return this.get<IGovernance>(`${this.api}/governances/${address}`);
  }

  public rewardMiningPoolsQuote(address: string, payload: any): Observable<any> {
    return this.post<any>(`${this.api}/governances/${address}/reward-mining-pools`, payload);
  }

  ////////////////////////////
  // Vaults
  ////////////////////////////

  public getVaults(): Observable<IVaults> {
    return this.get<IVaults>(`${this.api}/vaults`);
  }

  public getVault(address: string): Observable<IVault> {
    return this.get<IVault>(`${this.api}/vaults/${address}`);
  }

  public getVaultCertificates(address: string, limit?: number, cursor?: string): Observable<IVaultCertificates> {
    let query = cursor ? `?cursor=${cursor}` : `?limit=${limit}&direction=ASC`;
    return this.get<IVaultCertificates>(`${this.api}/vaults/${address}/certificates${query}`);
  }

  ////////////////////////////
  // Markets
  ////////////////////////////

  public getMarketOverview(): Observable<IMarket> {
    return this.get<IMarket>(`${this.api}/markets`);
  }

  public getMarketHistory(timeSpan: string = '1Y'): Observable<IMarketSnapshot> {
    return this.get<IMarketSnapshot>(`${this.api}/markets/history?timeSpan=${timeSpan}`);
  }

  ////////////////////////////
  // Transactions
  ////////////////////////////

  public getTransactions(request: TransactionRequest): Observable<ITransactionReceipts> {
    return this.get<ITransactionReceipts>(`${this.api}/transactions${request.buildQueryString()}`);
  }

  public getTransaction(hash: string): Observable<ITransactionReceipt> {
    return this.get<ITransactionReceipt>(`${this.api}/transactions/${hash}`);
  }

  public broadcastQuote(payload: any): Observable<ITransactionBroadcast> {
    return this.post<ITransactionBroadcast>(`${this.api}/transactions/broadcast-quote`, payload);
  }

  public replayQuote(payload: any): Observable<ITransactionQuote> {
    return this.post<ITransactionQuote>(`${this.api}/transactions/replay-quote`, payload);
  }

  public notifyTransaction(payload: any): Observable<void> {
    return this.post(`${this.api}/transactions`, payload);
  }

  ////////////////////////////////////////////////////////
  // Wallet Transactions - Temporary Local ENV only
  ////////////////////////////////////////////////////////

  // Balances
  public getWalletBalances(wallet: string, limit?: number, cursor?: string): Observable<IAddressBalances> {
    let query = cursor ? `?cursor=${cursor}` : `?limit=${limit}&direction=ASC&includeLpTokens=false`;

    return this.get<IAddressBalances>(`${this.api}/wallet/${wallet}/balance${query}`);
  }

  public getAllowance(owner: string, spender: string, token: string): Observable<IAddressAllowanceResponse> {
    return this.get<IAddressAllowanceResponse>(`${this.api}/wallet/${owner}/allowance/${token}/approved/${spender}`);
  }

  public getBalance(owner: string, token: string): Observable<IAddressBalance> {
    return this.get<IAddressBalance>(`${this.api}/wallet/${owner}/balance/${token}`);
  }

  public getStakingPosition(owner: string, liquidityPool: string): Observable<IAddressStaking> {
    return this.get<IAddressStaking>(`${this.api}/wallet/${owner}/staking/${liquidityPool}`);
  }

  public getMiningPosition(owner: string, miningPool: string): Observable<IAddressMining> {
    return this.get<IAddressMining>(`${this.api}/wallet/${owner}/mining/${miningPool}`);
  }

  public getMiningPositions(owner: string, limit?: number, cursor?: string): Observable<IAddressMiningPositions> {
    let query = cursor ? `?cursor=${cursor}` : `?limit=${limit}&direction=ASC`;

    return this.get<IAddressMiningPositions>(`${this.api}/wallet/${owner}/mining${query}`);
  }

  public getStakingPositions(owner: string, limit?: number, cursor?: string): Observable<IAddressStakingPositions> {
    let query = cursor ? `?cursor=${cursor}` : `?limit=${limit}&direction=ASC`;

    return this.get<IAddressStakingPositions>(`${this.api}/wallet/${owner}/staking${query}`);
  }
}
