import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VaultsService extends CacheService {
  private vaultAddress = environment.vaultAddress;

  constructor(private _platformApi: PlatformApiService) {
    super();
  }

  getVault(): Observable<any> {
    return this.getItem(this.vaultAddress, this._platformApi.getVault(this.vaultAddress));
  }

  refreshVault(): void {
    this.refreshItem(this.vaultAddress);
  }
}
