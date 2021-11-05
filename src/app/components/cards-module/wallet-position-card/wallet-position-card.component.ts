import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { AddressPosition } from '@sharedModels/address-position';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'opdex-wallet-position-card',
  templateUrl: './wallet-position-card.component.html',
  styleUrls: ['./wallet-position-card.component.scss']
})
export class WalletPositionCardComponent {
  @Input() position: AddressPosition;
  icons = Icons;
  iconSizes = IconSizes;
}
