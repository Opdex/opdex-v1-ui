import { IconSizes } from './../../../enums/icon-sizes';
import { Component, Input } from '@angular/core';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-copy-address',
  templateUrl: './copy-address.component.html',
  styleUrls: ['./copy-address.component.scss']
})
export class CopyAddressComponent {
  @Input() address: string;
  @Input() stopPropagation = false;
  @Input() short = false;
  icons = Icons;
  iconSizes = IconSizes;
  copied = false;

  copyHandler(event: Event) {
    if (this.stopPropagation) event.stopPropagation();
    this.copied = true;
    setTimeout(() => this.copied = false, 1000);
  }
}
