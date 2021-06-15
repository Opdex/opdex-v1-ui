import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'opdex-tx-allowance',
  templateUrl: './tx-allowance.component.html',
  styleUrls: ['./tx-allowance.component.scss']
})
export class TxAllowanceComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit(): void {
  }

}
