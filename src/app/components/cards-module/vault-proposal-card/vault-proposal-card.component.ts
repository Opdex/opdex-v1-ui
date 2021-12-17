import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { Component, Input } from '@angular/core';
import { IVaultProposalResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-response-model.interface';

@Component({
  selector: 'opdex-vault-proposal-card',
  templateUrl: './vault-proposal-card.component.html',
  styleUrls: ['./vault-proposal-card.component.scss']
})
export class VaultProposalCardComponent {
  @Input() proposal: IVaultProposalResponseModel;
  @Input() latestBlock: IBlock;

  getExpirationPercentage() {
    if (this.proposal.status === 'Complete' || this.proposal.expiration <= this.latestBlock.height) return 100;

    const threeDays = 60 * 60 * 24 * 3 / 16;
    const oneWeek = 60 * 60 * 24 * 7 / 16;
    const duration = this.proposal.status === 'Pledge' ? oneWeek : threeDays;
    const startBlock = this.proposal.expiration - duration;
    const blocksPassed = this.latestBlock.height - startBlock;

    return Math.floor((blocksPassed / duration) * 100);
  }
}
