import { Component, Input } from '@angular/core';
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
  @Input() thin: boolean = false;
  @Input() closable: boolean = false;
  @Input() noPadding: boolean = false;
  @Input() hasToolbar = false;
  icons = Icons;

  closed: boolean;

  close() {
    this.closed = true;
  }
}
