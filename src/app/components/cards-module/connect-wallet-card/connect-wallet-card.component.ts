import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CollapseAnimation } from '@sharedServices/animations/collapse';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-connect-wallet-card',
  templateUrl: './connect-wallet-card.component.html',
  styleUrls: ['./connect-wallet-card.component.scss'],
  animations: [CollapseAnimation]
})
export class ConnectWalletCardComponent {
  @Output() onConnectWallet = new EventEmitter();
  @Input() collapsed = true;

  icons = Icons;
  iconSizes = IconSizes;

  connectWallet() {
    this.onConnectWallet.emit(null);
  }

  toggleConnectMessage() {
    this.collapsed = !this.collapsed;
  }
}
