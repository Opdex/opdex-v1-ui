import { ControlValueAccessor } from '@angular/forms';

export abstract class ValueAccessor implements ControlValueAccessor {
  value: any;

  onChange: (val) => void;
  onTouched: () => void;

  writeValue(value: any) {
    console.log(value);
    this.value = value;
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
