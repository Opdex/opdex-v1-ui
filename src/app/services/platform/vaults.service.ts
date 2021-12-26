import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VaultsService extends CacheService {
  private vaultAddress: string

  constructor(
    private _platformApi: PlatformApiService,
    private _env: EnvironmentsService,
    protected _injector: Injector
  ) {
    super(_injector);
    this.vaultAddress = this._env.vaultAddress;
  }

  getVault(): Observable<any> {
    return this.getItem(this.vaultAddress, this._platformApi.getVault(this.vaultAddress));
  }

  getVaultCertificates(limit, cursor): Observable<any> {
    return this.getItem(`${this.vaultAddress}-${cursor ? cursor : limit}`, this._platformApi.getVaultCertificates(this.vaultAddress, limit, cursor));
  }
}
