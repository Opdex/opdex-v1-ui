import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ApiResponse } from '@sharedModels/responses/api-response';
import { RestApiService } from './rest-api.service';
import { ErrorService } from '@sharedServices/utility/error.service';
import { LoggerService } from '@sharedServices/utility/logger.service';
import { WalletService } from '@sharedServices/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class PlatformApiService extends RestApiService {
  private api: string;

  constructor(
    protected _http: HttpClient,
    protected _error: ErrorService,
    private _log: LoggerService,
    private _wallet: WalletService
  ) {
    super(_http, _error);
    this.api = environment.api;
  }

  //////////////
  // Auth
  //////////////

  public async auth(market: string, wallet: string): Promise<void> {
    const response = await this.post(`${this.api}/auth/authorize?wallet=${wallet}&market=${market}`, {});
    if (response.hasError) {
      // handle
    }

    this._wallet.setToken(response.data);
  }

  //////////////
  // Token
  //////////////

  public async getToken(address: string): Promise<ApiResponse<any>> {
    return await this.get(`${this.api}/tokens/${address}`);
  }

  public async getTokens(): Promise<ApiResponse<any[]>> {
    return await this.get(`${this.api}/tokens`);
  }

  //////////////
  // Pool
  //////////////

  public async getPool(address: string): Promise<ApiResponse<any>> {
    return await this.get(`${this.api}/pools/${address}`);
  }

  public async getPoolsByMarketAddress(marketAddress: string): Promise<ApiResponse<any[]>> {
    return await this.get(`${this.api}/pools/market/${marketAddress}`);
  }

  public async getPoolTransactions(address: string): Promise<ApiResponse<any>> {
    return await this.get(`${this.api}/pools/${address}/transactions`);
  }

  public async getPoolHistory(address: string): Promise<ApiResponse<any>> {
    return await this.get(`${this.api}/pools/${address}/history`);
  }

  //////////////
  // Markets
  //////////////

  public async getMarketOverview(): Promise<ApiResponse<any>> {
    return await this.get(`${this.api}/market`);
  }

  //////////////
  // Pools
  //////////////

  public async quoteAddLiquidity(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/quote/add-liquidity`, payload);
  }

  public async getSwapQuote(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/quote/swap`, payload);
  }

  ////////////////////////////////////////////////////////
  // Wallet Transactions - Temporary Local ENV only
  ////////////////////////////////////////////////////////
  public async swap(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/swap`, payload);
  }

  // Create Liquidity Pool
  public async createPool(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/create-pool`, payload);
  }

  // Liquidity Providing
  public async addLiquidity(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/add-liquidity`, payload);
  }

  public async removeLiquidity(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/remove-liquidity`, payload);
  }

  // Allowance
  public async approveAllowance(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/approve-allowance`, payload);
  }

  // Mining
  public async startMining(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/start-mining`, payload);
  }

  public async stopMining(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/stop-mining`, payload);
  }

  public async collectMiningRewards(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/collect-mining-rewards`, payload);
  }

  // Staking
  public async startStaking(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/start-staking`, payload);
  }

  public async stopStaking(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/stop-staking`, payload);
  }

  public async collectStakingRewards(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/build-transaction/local-broadcast/collect-staking-rewards`, payload);
  }

  // Balances

  public async getWalletSummaryForPool(pool: string, wallet: string): Promise<ApiResponse<any>> {
    return await this.get(`${this.api}/wallet/summary/pool/${pool}?walletAddress=${wallet}`);
  }
}

