import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@sharedServices/utility/value-accessor';

@Component({
  selector: 'opdex-deadline-slider',
  templateUrl: './deadline-slider.component.html',
  styleUrls: ['./deadline-slider.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DeadlineSliderComponent), multi: true }
  ]
})
export class DeadlineSliderComponent extends ValueAccessor implements OnInit {
  @Input() label: string;
  @Input() default: number;

  constructor() {
    super();
  }

  today: Date = new Date();

  ngOnInit(): void {}

  setValue(event: MatSliderChange ): void {
    const newDeadline = new Date();
    newDeadline.setMinutes(this.today.getMinutes() + event.value);
    super.value = newDeadline;
    this.default = event.value;
  }

}
