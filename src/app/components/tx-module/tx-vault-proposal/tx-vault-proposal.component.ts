import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { TransactionView } from '@sharedModels/transaction-view';

@Component({
  selector: 'opdex-tx-vault-proposal',
  templateUrl: './tx-vault-proposal.component.html',
  styleUrls: ['./tx-vault-proposal.component.scss']
})
export class TxVaultProposalComponent implements OnChanges {
  @Input() data: any;
  // @Output() onPoolSelection = new EventEmitter<ILiquidityPoolResponse>();
  child: number = 1;
  txOptions = [
    { action: 'Create', value: 1 },
    { action: 'Pledge', value: 2 },
    { action: 'Vote', value: 3 },
  ];

  ngOnChanges() {
    console.log(this.data)
    this.child = this.txOptions.find(o => o.action.toLowerCase() == this.data?.child?.toLowerCase())?.value || 1;
    console.log(this.child)
  }
}
