import { WalletService } from '@sharedServices/wallet.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TransactionsService {

  constructor(
    private _platform: PlatformApiService,
    private _wallet: WalletService
  ) {

  }
}
