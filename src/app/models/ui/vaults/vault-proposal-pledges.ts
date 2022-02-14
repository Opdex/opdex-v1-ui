import { PagingResults } from '@sharedModels/ui/paging-results';
import { IVaultProposalPledgesResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-pledges-response-model.interface';
import { VaultProposalPledge } from './vault-proposal-pledge';

export class VaultProposalPledges extends PagingResults<VaultProposalPledge> {
  constructor(pledges: IVaultProposalPledgesResponseModel) {
    super(pledges.results.map(pledge => new VaultProposalPledge(pledge)), pledges.paging);
  }
}
