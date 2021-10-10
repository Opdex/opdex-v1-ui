import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';
import { IMiningPool } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';

@Injectable({ providedIn: 'root' })
export class MiningPoolsService extends CacheService {

  constructor(private _platformApi: PlatformApiService) {
    super();
  }

  getMiningPool(address: string): Observable<IMiningPool> {
    return this.getItem(address, this._platformApi.getMiningPool(address));
  }

  refreshMiningPool(address: string): void {
    this.refreshItem(address);
  }
}
