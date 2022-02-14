import { IVaultProposalsResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposals-response-model.interface';
import { PagingResults } from '../paging-results';
import { VaultProposal } from "./vault-proposal";

export class VaultProposals extends PagingResults<VaultProposal> {
  constructor(proposals: IVaultProposalsResponseModel) {
    super(proposals.results.map(proposal => new VaultProposal(proposal)), proposals.paging);
  }
}
