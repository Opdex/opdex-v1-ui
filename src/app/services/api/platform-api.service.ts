import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ApiResponse } from '@sharedModels/responses/api-response';
import { RestApiService } from './rest-api.service';
import { ErrorService } from '@sharedServices/utility/error.service';
import { LoggerService } from '@sharedServices/utility/logger.service';

@Injectable({
  providedIn: 'root'
})
export class PlatformApiService extends RestApiService {
  private api: string;

  constructor(
    protected _http: HttpClient,
    protected _error: ErrorService,
    private _log: LoggerService
  ) {
    super(_http, _error);
    this.api = environment.api;
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

  public async getPools(): Promise<ApiResponse<any[]>> {
    return await this.get(`${this.api}/pools`);
  }

  //////////////
  // Markets
  //////////////

  public async getMarketOverview(): Promise<ApiResponse<any>> {
    return await this.get(`${this.api}/market`);
  }


  //////////////////////////////////////////////////
  // Wallet Transactions - Temporary Local ENV only
  /////////////////////////////////////////////////
  public async swap(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/wallet-transactions/build/swap`, payload);
  }

  public async addLiquidity(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/wallet-transactions/build/add-liquidity`, payload);
  }

  public async removeLiquidity(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/wallet-transactions/build/remove-liquidity`, payload);
  }

  public async createPool(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/wallet-transactions/build/create-pool`, payload);
  }

  public async approveAllowance(payload: any): Promise<ApiResponse<any>> {
    return await this.post(`${this.api}/wallet-transactions/build/approve-allowance`, payload);
  }
}