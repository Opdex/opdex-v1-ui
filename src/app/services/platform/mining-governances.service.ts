import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MiningGovernancesService extends CacheService {

  constructor(private _platformApi: PlatformApiService, protected _injector: Injector) {
    super(_injector);
  }

  getMiningGovernance(address: string): Observable<any> {
    return this.getItem(address, this._platformApi.getMiningGovernance(address));
  }

  refreshMiningGovernance(address: string): void {
    this.refreshItem(address);
  }
}
