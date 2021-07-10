import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'opdex-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() daily = false;
  @Input() title: string;
  @Input() value: string;
  @Input() change: number = null;
}
