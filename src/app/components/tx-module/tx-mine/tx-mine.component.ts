import { TransactionView } from '@sharedModels/transaction-view';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';

@Component({
  selector: 'opdex-tx-mine',
  templateUrl: './tx-mine.component.html',
  styleUrls: ['./tx-mine.component.scss']
})
export class TxMineComponent implements OnChanges {
  @Input() data: any;
  @Output() onPoolSelection = new EventEmitter<ILiquidityPoolResponse>();
  pool: ILiquidityPoolResponse;
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

  handlePoolChange(pool: ILiquidityPoolResponse) {
    this.onPoolSelection.emit(pool);
  }
}
