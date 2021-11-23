import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { TransactionView } from '@sharedModels/transaction-view';

@Component({
  selector: 'opdex-tx-stake',
  templateUrl: './tx-stake.component.html',
  styleUrls: ['./tx-stake.component.scss']
})
export class TxStakeComponent {
  @Input() data: any = {};
  @Output() onPoolSelection = new EventEmitter<ILiquidityPoolResponse>();
  pool: ILiquidityPoolResponse;
  view = TransactionView.stake;
  child: number = 1;
  txOptions = [
    { action: 'Start', value: 1 },
    { action: 'Stop', value: 2 },
    { action: 'Collect', value: 3 }
  ];

  ngOnChanges() {
    this.child = this.txOptions.find(o => o.action.toLowerCase() == this.data?.child)?.value || 1;
    this.pool = this.data?.pool;
  }

  handlePoolChange(pool: ILiquidityPoolResponse) {
    // this.pool = pool;
    // this.data = { pool };
    this.onPoolSelection.emit(pool);
  }
}
