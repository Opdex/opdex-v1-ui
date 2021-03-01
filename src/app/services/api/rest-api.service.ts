import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@sharedModels/responses/api-response';
import { ErrorService } from '@sharedServices/utility/error.service';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  constructor(protected _http: HttpClient, protected _error: ErrorService) { }

  protected async get(endpoint: string): Promise<ApiResponse<any>> {
    return await this.executeCallAsync(() => this._http.get(endpoint), endpoint);
  }

  protected async post(endpoint: string, body: any): Promise<ApiResponse<any>> {
    return await this.executeCallAsync(() => this._http.post(endpoint, body), endpoint, body);
  }

  protected async put(endpoint: string, body: any): Promise<ApiResponse<any>> {
    return await this.executeCallAsync(() => this._http.put(endpoint, body), endpoint, body);
  }

  protected async patch(endpoint: string, body: any): Promise<ApiResponse<any>> {
    return await this.executeCallAsync(() => this._http.patch(endpoint, body), endpoint, body);
  }

  protected async detete(endpoint: string): Promise<ApiResponse<any>> {
    return await this.executeCallAsync(() => this._http.delete(endpoint), endpoint);
  }

  private async executeCallAsync(method: Function, endpoint: string, body?: any) {
    try {
      const response = await method().toPromise();
      return new ApiResponse<any>({ data: response });
    } catch (error) {
      this._error.logHttpError(error, endpoint, body);
      return new ApiResponse<any>({ error });
    }
  }
}
