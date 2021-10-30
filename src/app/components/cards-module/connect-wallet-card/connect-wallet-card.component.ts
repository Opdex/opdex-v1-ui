import { Component, Output, EventEmitter } from '@angular/core';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-connect-wallet-card',
  templateUrl: './connect-wallet-card.component.html',
  styleUrls: ['./connect-wallet-card.component.scss']
})
export class ConnectWalletCardComponent {
  @Output() onConnectWallet = new EventEmitter();

  hideConnectMessage = false;
  icons = Icons;
  iconSizes = IconSizes;

  connectWallet() {
    this.onConnectWallet.emit(null);
  }

  toggleConnectMessage() {
    this.hideConnectMessage = !this.hideConnectMessage;
  }
}
