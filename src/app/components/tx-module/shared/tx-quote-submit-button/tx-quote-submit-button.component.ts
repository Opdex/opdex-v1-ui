import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'opdex-tx-quote-submit-button',
  templateUrl: './tx-quote-submit-button.component.html',
  styleUrls: ['./tx-quote-submit-button.component.scss']
})
export class TxQuoteSubmitButtonComponent {
  @Input() disabled: boolean;
  @Input() warn: boolean;
  @Output() onSubmit = new EventEmitter();
  icons = Icons;
  iconSizes = IconSizes;

  submit(): void {
    this.onSubmit.emit();
  }
}
