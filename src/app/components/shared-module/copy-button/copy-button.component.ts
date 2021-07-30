import { Component, Input, OnInit } from '@angular/core';
import { IconSizes } from 'src/app/enums/icon-sizes';

@Component({
  selector: 'opdex-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.scss']
})
export class CopyButtonComponent {

  @Input() tooltip: string;
  @Input() value: any;
  @Input() size: string; // Should use the enum for icon sizes, icon-sizes.ts
  @Input() icon: string; 

  copied = false;

  constructor() { }

  copyHandler($event) {
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 1000);
  }

}
