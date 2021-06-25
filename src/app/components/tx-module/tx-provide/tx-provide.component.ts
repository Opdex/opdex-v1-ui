import { Component, Input, OnChanges } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-tx-provide',
  templateUrl: './tx-provide.component.html',
  styleUrls: ['./tx-provide.component.scss']
})
export class TxProvideComponent implements OnChanges {
  @Input() data: any;
  pool: ILiquidityPoolSummaryResponse;
  child: number = 1;
  txOptions = [
    { action: 'Add', value: 1 },
    { action: 'Remove', value: 2 }
  ];

  ngOnChanges() {
    this.child = this.txOptions.find(o => o.action.toLowerCase() == this.data?.child)?.value || 1;
    this.pool = this.data?.pool;
  }
}
