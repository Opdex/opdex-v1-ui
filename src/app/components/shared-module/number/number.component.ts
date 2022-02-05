import { Component, Input } from '@angular/core';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

@Component({
  selector: 'opdex-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent {
  @Input() value: FixedDecimal;
  @Input() short: boolean = false;
  @Input() prefix: string;
  @Input() suffix: string;

  get numerator(): string {
    return this.value.wholeNumber || '0';
  }

  get denominator(): string {
    return this.value.fractionNumber || '';
  }

  get fixed(): string {
    return this.value.formattedValue;
  }

  get decimals(): number {
    return this.value.decimals;
  }
}
