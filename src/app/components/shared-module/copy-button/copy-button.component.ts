import { Component, Input } from '@angular/core';
import { IconSizes } from 'src/app/enums/icon-sizes';

@Component({
  selector: 'opdex-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.scss']
})
export class CopyButtonComponent {
  @Input() color: string;
  @Input() tooltip: string;
  @Input() value: any;
  @Input() size: IconSizes;
  @Input() icon: string;

  copied = false;

  copyHandler() {
    this.copied = true;
    setTimeout(() => this.copied = false, 1000);
  }
}
