import { Component, Input, OnChanges } from '@angular/core';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnChanges {
  @Input() data: string | object;
  copied: boolean;
  icons = Icons;
  qr: string;

  ngOnChanges() {
    // Make sure the data is safe for QR codes
    this.qr = typeof this.data === 'string' ? this.data : JSON.stringify(this.data);
  }

  copyHandler() {
    this.copied = true;
    setTimeout(() => this.copied = false, 1000);
  }
}

