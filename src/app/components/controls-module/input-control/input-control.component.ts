import { DecimalStringRegex } from '@sharedLookups/regex';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@sharedServices/utility/value-accessor';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-input-control',
  templateUrl: './input-control.component.html',
  styleUrls: ['./input-control.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputControlComponent), multi: true }
  ]
})
export class InputControlComponent extends ValueAccessor {
  constructor() {
    super();
  }

  @Input() formControl: FormControl;
  @Input() suffix: string;
  @Input() suffixDisabled: boolean = false;
  @Input() prefixIcon: Icons;
  @Input() prefixIconDisabled = true;
  @Input() label: string;
  @Input() showLabel: boolean = true;
  @Input() placeholder: string = "0.00";
  @Input() numbersOnly: boolean = false;
  @Input() active: boolean = false;
  @Output() handleChangeToken: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPrefixClick: EventEmitter<any> = new EventEmitter<any>();

  clickPrefix(): void {
    this.onPrefixClick.emit();
  }

  changeToken(): void {
    this.handleChangeToken.emit();
  }

  // Known issues:
  // Pasting does not validate the clipboard and cannot asynchronously with this implementation
  // Backspace allows you to backspace into an invalid state
  // Validation on updatedValue is incorrect because we don't know the cursor location of the input
  decimalNumberKeyValidator(event: KeyboardEvent) {
    if (!this.numbersOnly) return;

    // Return when invalid immediately
    if (event.key === null || event.key === undefined) {
      event.preventDefault();
      return;
    }

    const isArrow = event.key.includes('Arrow');
    if (isArrow) return;

    // Take current previous control value prior to this keystroke
    let previousControlValue = this.formControl.value;

    // Append this keystroke
    let updatedValue = `${previousControlValue}${event.key}`;

    const isBackspace = event.key === 'Backspace' || event.key === 'Delete';
    if (isBackspace) return; // allow

    const isShortcut = (event.ctrlKey || event.metaKey) && event.key;

    if (isShortcut && event.key === 'a') return;
    if (isShortcut && event.key === 'c') return;
    if (isShortcut && event.key === 'x') return;

    // bugged, need to check the clipboard first to validate it but that is asynchronous,
    // need to check into something like this: https://www.tsmean.com/articles/angular/angular-control-value-accessor-example/
    // adjust control value accessors to potentially make these validations. Allowing all for now.
    // Allows anything to be pasted, does not run regex or validations
    if (isShortcut && event.key === 'v') return;

    // If regex does not result in an empty string, it does not meet the regex required
    // Consider changing logic to check updatedValue === sanitize(regex, updatedValue);
    if (updatedValue.replace(DecimalStringRegex, '') !== '') {
      event.preventDefault();
    }
  }
}
