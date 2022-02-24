import { Icons } from 'src/app/enums/icons';
import { Component, EventEmitter, Output } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'opdex-chart-template',
  templateUrl: './chart-template.component.html',
  styleUrls: ['./chart-template.component.scss']
})
export class ChartTemplateComponent {
  @Output() onResized = new EventEmitter<ResizedEvent>();
  locked: boolean = true;
  icons = Icons;

  toggleLock(): void {
    this.locked = !this.locked;
  }

  resize($event: ResizedEvent) {
    this.onResized.emit($event)
  }
}
