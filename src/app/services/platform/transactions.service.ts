import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';

@Injectable({ providedIn: 'root' })
export class TransactionsService extends CacheService {

  constructor(private _platformApi: PlatformApiService) {
    super();
  }
}
