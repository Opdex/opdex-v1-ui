import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'opdex-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.scss']
})
export class CopyButtonComponent implements OnInit {

  @Input() tooltip: string;
  @Input() address: string;
  @Input() size: string; 

  constructor() { }

  ngOnInit(): void {
  }

  copyHandler(event: boolean): void {
    console.log(event);
  }

}
