import { TransactionView } from '@sharedModels/transaction-view';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-tx-mine',
  templateUrl: './tx-mine.component.html',
  styleUrls: ['./tx-mine.component.scss']
})
export class TxMineComponent implements OnChanges {
  @Input() data: any;
  @Output() onPoolSelection = new EventEmitter<ILiquidityPoolSummary>();
  pool: ILiquidityPoolSummary;
  child: number = 1;
  view = TransactionView.mine;
  txOptions = [
    { action: 'Start', value: 1 },
    { action: 'Stop', value: 2 },
    { action: 'Collect', value: 3 }
  ];

  ngOnChanges(): void {
    this.child = this.txOptions.find(o => o.action.toLowerCase() == this.data?.child)?.value || 1;
    this.pool = this.data?.pool;
  }

  handlePoolChange(pool: ILiquidityPoolSummary) {
    this.onPoolSelection.emit(pool);
  }
}
