import { Component, Input } from '@angular/core';

@Component({
  selector: 'opdex-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() fullHeight: boolean = false;
  @Input() warn: boolean = false;
  @Input() success: boolean = false;
  @Input() closable: boolean = false;
  @Input() noPadding: boolean = false;
  @Input() hasToolbar = false;

  closed: boolean;

  close() {
    this.closed = true;
  }
}
