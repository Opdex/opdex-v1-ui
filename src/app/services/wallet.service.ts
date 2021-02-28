import { Injectable } from '@angular/core';
import { Transaction, Address, PrivateKey, PublicKey, Networks } from 'bitcore-lib';

@Injectable({ providedIn: 'root' })
export class WalletService {
  constructor() {

  }

  // Using Bitcore-lib and SubtleCrypto

  // Import Wallet
  public importWif(wif: string): void {
    var address = new PrivateKey(wif).toAddress();
  }

  // Create/Sign Transaction

  // Remove Wallet

  // Get CrsBalance

  // Get SrcBalances

  // Get Uxtos
}
