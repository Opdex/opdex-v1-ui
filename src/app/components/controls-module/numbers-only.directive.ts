import { NgControl } from '@angular/forms';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { DecimalStringRegex, sanitize } from '@sharedLookups/regex';

@Directive({
  selector: '[opdexNumbersOnly]'
})
export class NumbersOnlyDirective {
  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event']) onInputChange() {
    const initialValue = this.el.nativeElement.value.toString();
    const sanitized = sanitize(DecimalStringRegex, initialValue);

    this.control.control.setValue(sanitized.toString(), {emitEvent: false})
    this.el.nativeElement.value = sanitized.toString();
  }
}
