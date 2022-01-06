import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'opdex-tx-quote-error',
  templateUrl: './tx-quote-error.component.html',
  styleUrls: ['./tx-quote-error.component.scss']
})
export class TxQuoteErrorComponent {
  @Input() message: string;
  @Input() warn = false;

  icons = Icons;
  iconSizes = IconSizes;
}
