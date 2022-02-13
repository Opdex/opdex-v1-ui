import { IVaultProposalVotesResponseModel } from "@sharedModels/platform-api/responses/vaults/vault-proposal-votes-response-model.interface";
import { PagingResults } from "../paging-results";
import { VaultProposalVote } from "./vault-proposal-vote";

export class VaultProposalVotes extends PagingResults<VaultProposalVote> {
  constructor(votes: IVaultProposalVotesResponseModel) {
    super(votes.results.map(vote => new VaultProposalVote(vote)), votes.paging);
  }
}
