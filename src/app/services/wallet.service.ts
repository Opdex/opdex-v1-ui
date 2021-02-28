import { Injectable } from '@angular/core';
import { Transaction, Address, PrivateKey, PublicKey, Networks } from 'bitcore-lib';

@Injectable({ providedIn: 'root' })

/*
 * Theoretical class depending on how users are going to be signing transactions.
 * Idea 1: Opdex Builds Transaction and displays QR code
 *  - Users scan QR code via Stratis Mobile Wallet - sign and broadcast from there
 *  - How would/should the UI watch to notify user of completion?
 *  - Or how would user copy/past the signed transaction back to Opdex to be broadcast?
 * Idea 2: Optional WIF private key support via this service
 *  - Opdex builds transaction
 *  - Users pastes private key into Opdex client
 *  - Tx is signed and WIF is discarded, never kept around or persisted
 * Idea 3: Opdex builds transaction user signs va Cirrus Core desktop wallet
 *  - User copies transaction (base64 or something to make it short and less error prone than JSON)
 *  - Pastes into Cirrus Core wallet to sign and broadcast
 *  - Same problem as Idea 1: How would opdex UI know to notify the user?
 *     - Using desktop Opdex site and Cirrus Core FN - user could paste the transactionId to opdex
 */
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
