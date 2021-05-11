import { Component, Input } from '@angular/core';

@Component({
  selector: 'opdex-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() fullHeight: boolean = false;
}
