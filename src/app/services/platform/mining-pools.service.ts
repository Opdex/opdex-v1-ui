import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';
import { IMiningPool } from '@sharedModels/platform-api/responses/mining-pools/mining-pool.interface';

@Injectable({ providedIn: 'root' })
export class MiningPoolsService extends CacheService {

  constructor(private _platformApi: PlatformApiService, protected _injector: Injector) {
    super(_injector);
  }

  getMiningPool(address: string): Observable<IMiningPool> {
    return this.getItem(address, this._platformApi.getMiningPool(address));
  }
}
