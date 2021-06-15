import { Component, Input } from '@angular/core';

@Component({
  selector: 'opdex-tx-stake',
  templateUrl: './tx-stake.component.html',
  styleUrls: ['./tx-stake.component.scss']
})
export class TxStakeComponent {
  @Input() data: any;
  pool: any;

  ngOnChanges() {
    this.pool = this.data?.pool;
  }
}
