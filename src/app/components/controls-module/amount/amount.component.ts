import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@sharedServices/utility/value-accessor';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AmountComponent), multi: true }
  ]
})
export class AmountComponent extends ValueAccessor {

  constructor() {
    super();
  }
 
  @Input() formControl: FormControl;
  @Input() suffix: string;
  @Input() prefixIcon: Icons;
  @Input() label: string;
  @Input() placeholder: string = "0.00";
  @Output() handleChangeToken: EventEmitter<any> = new EventEmitter<any>();

  changeToken(): void {
    this.handleChangeToken.emit();
  }
}
