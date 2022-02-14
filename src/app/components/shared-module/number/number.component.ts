import { Icons } from 'src/app/enums/icons';
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
  @Input() precision: number;
  @Input() stopPropagation = false;
  @Input() preventCopy = false;
  copied = false;
  icons = Icons;

  get numerator(): string {
    return this.value.wholeNumber || '0';
  }

  get denominator(): string {
    const value = this._precision();
    return value.fractionNumber || '';
  }

  get fixed(): string {
    return this.value.formattedValue;
  }

  get decimals(): number {
    return this.value.decimals;
  }

  get showTooltip(): boolean {
    return this.value.bigInt > 0 && ((this.precision >= 0 && this.precision < this.decimals) || this.short);
  }

  copyHandler(event: Event): void {
    if (this.stopPropagation) event.stopPropagation();
    if (this.preventCopy) return;
    this.copied = true;
    setTimeout(() => this.copied = false, 500);
  }

  private _precision(): FixedDecimal {
    if (this.precision >= 0 && this.precision < this.value.decimals) {
      return new FixedDecimal(this.value.formattedValue, this.precision);
    }

    return this.value;
  }
}
