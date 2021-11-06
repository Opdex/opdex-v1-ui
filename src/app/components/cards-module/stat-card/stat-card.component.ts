import { Component, Input} from '@angular/core';
import { StatCardInfo } from '@sharedModels/stat-card-info';

@Component({
  selector: 'opdex-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent{
  @Input() statInfo: StatCardInfo;
}
