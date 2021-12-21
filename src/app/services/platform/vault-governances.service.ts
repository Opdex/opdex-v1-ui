import { IVaultCertificates } from '@sharedModels/platform-api/responses/vaults/vault-certificate.interface';
import { IVaultGovernanceResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-governance-response-model.interface';
import { Injectable, Injector } from "@angular/core";
import { PlatformApiService } from "@sharedServices/api/platform-api.service";
import { CacheService } from "@sharedServices/utility/cache.service";
import { EnvironmentsService } from "@sharedServices/utility/environments.service";
import { Observable } from "rxjs";
import { VaultProposalsFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposals-filter';
import { IVaultProposalsResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposals-response-model.interface';
import { IVaultProposalVotesResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-votes-response-model.interface';
import { VaultProposalVotesFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-votes-filter';
import { VaultProposalPledgesFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-pledges-filter';
import { IVaultProposalPledgesResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-pledges-response-model.interface';
import { IVaultProposalVoteResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-vote-response-model.interface';
import { IVaultProposalResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-response-model.interface';
import { IVaultProposalPledgeResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-pledge-response-model.interface';
import { VaultCertificatesFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-certificates-filter';

@Injectable({ providedIn: 'root' })
export class VaultGovernancesService extends CacheService {
  private vaultAddress: string

  constructor(
    private _platformApi: PlatformApiService,
    private _env: EnvironmentsService,
    protected _injector: Injector
  ) {
    super(_injector);
    this.vaultAddress = this._env.vaultGovernanceAddress;
  }

  getVault(vault?: string): Observable<IVaultGovernanceResponseModel> {
    vault = vault || this.vaultAddress;
    return this.getItem(vault, this._platformApi.getVaultGovernance(vault));
  }

  getCertificates(request: VaultCertificatesFilter, vault?: string): Observable<IVaultCertificates> {
    vault = vault || this.vaultAddress;
    return this.getItem(`vault-${vault}-certificates-${request.buildQueryString()}`, this._platformApi.getVaultGovernanceCertificates(vault, request));
  }

  getProposal(proposalId: number, vault?: string): Observable<IVaultProposalResponseModel> {
    vault = vault || this.vaultAddress;
    return this.getItem(`vault-${vault}-proposal-${proposalId}`, this._platformApi.getVaultProposal(vault, proposalId));
  }

  getProposals(request: VaultProposalsFilter, vault?: string): Observable<IVaultProposalsResponseModel> {
    vault = vault || this.vaultAddress;
    return this.getItem(`vault-${vault}-proposals-${request.buildQueryString()}`, this._platformApi.getVaultProposals(vault, request));
  }

  getVotes(request: VaultProposalVotesFilter, vault?: string): Observable<IVaultProposalVotesResponseModel> {
    vault = vault || this.vaultAddress;
    return this.getItem(`vault-${vault}-proposal-votes-${request.buildQueryString()}`, this._platformApi.getVaultProposalVotes(vault, request));
  }

  getVote(proposalId: number, voter: string, vault?: string): Observable<IVaultProposalVoteResponseModel> {
    vault = vault || this.vaultAddress;
    return this.getItem(`vault-${vault}-proposal-${proposalId}-vote-${voter}`, this._platformApi.getVaultProposalVote(vault, proposalId, voter));
  }

  getPledges(request: VaultProposalPledgesFilter, vault?: string): Observable<IVaultProposalPledgesResponseModel> {
    vault = vault || this.vaultAddress;
    return this.getItem(`vault-${vault}-proposal-pledges-${request.buildQueryString()}`, this._platformApi.getVaultProposalPledges(vault, request));
  }

  getPledge(proposalId: number, pledger: string, vault?: string): Observable<IVaultProposalPledgeResponseModel> {
    vault = vault || this.vaultAddress;
    return this.getItem(`vault-${vault}-proposal-${proposalId}-pledge-${pledger}`, this._platformApi.getVaultProposalPledge(vault, proposalId, pledger));
  }

  refreshVault(vault?: string): void {
    vault = vault || this.vaultAddress;
    this.refreshItem(vault);
  }
}
