import { VaultProposal } from '@sharedModels/ui/vaults/vault-proposal';
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'opdex-tx-vault-proposal',
  templateUrl: './tx-vault-proposal.component.html',
  styleUrls: ['./tx-vault-proposal.component.scss']
})
export class TxVaultProposalComponent implements OnChanges {
  @Input() data: any;
  child: number = 1;
  txOptions = [
    { action: 'Create', value: 1 },
    { action: 'Pledge', value: 2 },
    { action: 'Vote', value: 3 },
  ];

  ngOnChanges() {
    this.child = this.txOptions.find(o => o.action.toLowerCase() == this.data?.child?.toLowerCase())?.value || 1;
  }

  handleProposalChange($event: VaultProposal) {
    if (!this.data) {
      this.data = { proposal: $event }
    } else {
      this.data.proposal = $event;
    }
  }
}
