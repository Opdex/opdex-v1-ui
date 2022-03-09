import { Component, Input } from '@angular/core';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() fullHeight: boolean = false;
  @Input() warn: boolean = false;
  @Input() success: boolean = false;
  @Input() info: boolean = false;
  @Input() closable: boolean = false;
  @Input() noPadding: boolean = false;
  @Input() hasToolbar = false;
  @Input() cardClasses = [];
  iconSizes = IconSizes;
  icons = Icons;
  closed: boolean;

  get classes(): string {
    return this.cardClasses.join(' ');
  }

  close() {
    this.closed = true;
  }
}
