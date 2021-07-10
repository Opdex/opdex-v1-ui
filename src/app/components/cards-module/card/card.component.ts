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
  @Input() thin: boolean = false;
  @Input() closable: boolean = false;

  closed: boolean;

  close() {
    console.log(this.closable);
    this.closed = true;
  }
}
