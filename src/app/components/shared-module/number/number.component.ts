import { Icons } from 'src/app/enums/icons';
import { Component, Input, ViewChild } from '@angular/core';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'opdex-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent {
  private _value: FixedDecimal;

  @ViewChild('tooltip') tooltip: MatTooltip;
  @Input() set value(value: FixedDecimal | number) {
    this._value = typeof value === 'number'
      ? new FixedDecimal(value.toFixed(0), 0)
      : this._value = value;
  };

  @Input() short: boolean = false;
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() precision: number;
  @Input() stopPropagation = false;
  @Input() preventCopy = false;
  copied = false;
  icons = Icons;

  get numerator(): string {
    return this._value.wholeNumber || '0';
  }

  get denominator(): string {
    const value = this._precision();
    return value.fractionNumber || '';
  }

  get fixed(): string {
    return this._value?.formattedValue;
  }

  get decimals(): number {
    return this._value.decimals;
  }

  get showTooltip(): boolean {
    return this._value.bigInt > 0 && ((this.precision >= 0 && this.precision < this.decimals) || this.short);
  }

  copyHandler(event: Event): void {
    if (this.stopPropagation) event.stopPropagation();
    if (this.preventCopy) return;

    this.tooltip.show();
    this.copied = true;

    setTimeout(() => {
      // Do a dance for the tooltips positioning. We show the tooltip on click because normally, on click tooltips are hidden.
      // Then during this timeout, we'll hide the 'Copied' tooltip, toggle the value, then re-enable tooltips.
      // Disabling then re-enabling after the tooltips value has changed keeps it center on the cursor.
      this.tooltip.hide();
      this.copied = false;
      this.tooltip.show();
    }, 500);
  }

  private _precision(): FixedDecimal {
    if (this.precision >= 0 && this.precision < this._value.decimals) {
      return new FixedDecimal(this._value.formattedValue, this.precision);
    }

    return this._value;
  }
}
