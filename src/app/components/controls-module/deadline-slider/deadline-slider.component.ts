import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'opdex-deadline-slider',
  templateUrl: './deadline-slider.component.html',
  styleUrls: ['./deadline-slider.component.scss']
})
export class DeadlineSliderComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  constructor() { }

  ngOnInit(): void {
  }

}
