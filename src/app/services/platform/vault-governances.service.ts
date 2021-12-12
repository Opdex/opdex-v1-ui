import { IVaultGovernanceResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-governance-response-model.interface';
import { Injectable, Injector } from "@angular/core";
import { PlatformApiService } from "@sharedServices/api/platform-api.service";
import { CacheService } from "@sharedServices/utility/cache.service";
import { EnvironmentsService } from "@sharedServices/utility/environments.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class VaultGovernancesService extends CacheService {
  private vaultAddress: string

  constructor(
    private _platformApi: PlatformApiService,
    private _env: EnvironmentsService,
    protected _injector: Injector
  ) {
    super(_injector);
    this.vaultAddress = this._env.vaultGovernanceAddress;
  }

  getVault(): Observable<IVaultGovernanceResponseModel> {
    console.log(this.vaultAddress)
    return this.getItem(this.vaultAddress, this._platformApi.getVaultGovernance(this.vaultAddress));
  }

  // getVaultCertificates(limit, cursor): Observable<any> {
  //   return this.getItem(`${this.vaultAddress}-${cursor ? cursor : limit}`, this._platformApi.getVaultCertificates(this.vaultAddress, limit, cursor));
  // }

  refreshVault(): void {
    this.refreshItem(this.vaultAddress);
  }

  // refreshVaultCertificates(limit, cursor): void {
  //   this.refreshItem(`${this.vaultAddress}-${cursor ? cursor : limit}`);
  // }
}
