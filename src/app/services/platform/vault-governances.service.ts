import { IVaultGovernanceResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-governance-response-model.interface';
import { Injectable, Injector } from "@angular/core";
import { PlatformApiService } from "@sharedServices/api/platform-api.service";
import { CacheService } from "@sharedServices/utility/cache.service";
import { EnvironmentsService } from "@sharedServices/utility/environments.service";
import { Observable } from "rxjs";
import { VaultProposalsFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposals-filter';
import { IVaultProposalsResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposals-response-model.interface';

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

  getVaults() {

  }

  getProposal(proposalId: number, vault?: string) {
    vault = vault || this.vaultAddress;
    return this.getItem(vault, this._platformApi.getVaultProposal(vault, proposalId));
  }

  getProposals(request: VaultProposalsFilter, vault?: string): Observable<IVaultProposalsResponseModel> {
    vault = vault || this.vaultAddress;
    return this.getItem(`vault-proposal-pledges-${vault}-${request.buildQueryString()}`, this._platformApi.getVaultProposals(vault, request));
  }

  getVotes() {

  }

  getVote(proposalId: number, voter: string, vault?: string) {
    vault = vault || this.vaultAddress;
    return this.getItem(vault, this._platformApi.getVaultProposalVote(vault, proposalId, voter));
  }

  getPledges() {

  }

  getPledge(proposalId: number, pledger: string, vault?: string) {
    vault = vault || this.vaultAddress;
    return this.getItem(vault, this._platformApi.getVaultProposalPledge(vault, proposalId, pledger));
  }

  refreshVault(vault?: string): void {
    vault = vault || this.vaultAddress;
    this.refreshItem(vault);
  }
}
