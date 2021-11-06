import { Component, Input } from '@angular/core';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-change-indicator',
  templateUrl: './change-indicator.component.html',
  styleUrls: ['./change-indicator.component.scss']
})
export class ChangeIndicatorComponent {
  @Input() value: number;
  @Input() size: 's' | 'm' | 'l' = 'l'
  @Input() forceDisplay: boolean = false;

  icons = Icons;
}
