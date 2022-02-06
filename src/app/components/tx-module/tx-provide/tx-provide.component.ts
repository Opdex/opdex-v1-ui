import { TransactionView } from '@sharedModels/transaction-view';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

@Component({
  selector: 'opdex-tx-provide',
  templateUrl: './tx-provide.component.html',
  styleUrls: ['./tx-provide.component.scss']
})
export class TxProvideComponent implements OnChanges {
  @Input() data: any;
  @Output() onPoolSelection = new EventEmitter<LiquidityPool>();
  pool: LiquidityPool;
  child: number = 1;
  view = TransactionView.provide;
  txOptions = [
    { action: 'Add', value: 1 },
    { action: 'Remove', value: 2 }
  ];

  ngOnChanges() {
    this.child = this.txOptions.find(o => o.action.toLowerCase() == this.data?.child)?.value || 1;
    this.pool = this.data?.pool;
  }

  handlePoolChange(pool: LiquidityPool) {
    this.onPoolSelection.emit(pool);
  }
}
