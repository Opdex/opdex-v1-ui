import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'opdex-change-indicator',
  templateUrl: './change-indicator.component.html',
  styleUrls: ['./change-indicator.component.scss']
})
export class ChangeIndicatorComponent {
  @Input() value: number;
}
