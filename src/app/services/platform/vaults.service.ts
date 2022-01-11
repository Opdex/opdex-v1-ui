import { IVaultCertificates } from '@sharedModels/platform-api/responses/vaults/vault-certificate.interface';
import { IVaultResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-response-model.interface';
import { Injectable, Injector } from "@angular/core";
import { PlatformApiService } from "@sharedServices/api/platform-api.service";
import { CacheService } from "@sharedServices/utility/cache.service";
import { EnvironmentsService } from "@sharedServices/utility/environments.service";
import { Observable, of } from "rxjs";
import { VaultProposalsFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposals-filter';
import { IVaultProposalsResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposals-response-model.interface';
import { IVaultProposalVotesResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-votes-response-model.interface';
import { VaultProposalVotesFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposal-votes-filter';
import { VaultProposalPledgesFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposal-pledges-filter';
import { IVaultProposalPledgesResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-pledges-response-model.interface';
import { IVaultProposalVoteResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-vote-response-model.interface';
import { IVaultProposalResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-response-model.interface';
import { IVaultProposalPledgeResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-pledge-response-model.interface';
import { VaultCertificatesFilter } from '@sharedModels/platform-api/requests/vaults/vault-certificates-filter';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class VaultsService extends CacheService {
  private vaultAddress: string

  constructor(
    private _platformApi: PlatformApiService,
    private _env: EnvironmentsService,
    protected _injector: Injector
  ) {
    super(_injector);
    this.vaultAddress = this._env.vaultAddress;
  }

  getVault(vault?: string): Observable<IVaultResponseModel> {
    vault = vault || this.vaultAddress;
    if (!!vault === false) return of();
    return this.getItem(vault, this._platformApi.getVault(vault));
  }

  getCertificates(request: VaultCertificatesFilter, vault?: string): Observable<IVaultCertificates> {
    vault = vault || this.vaultAddress;
    if (!!vault === false) return of();
    return this.getItem(`${vault}-certificates-${request.buildQueryString()}`, this._platformApi.getVaultCertificates(vault, request));
  }

  getProposal(proposalId: number, vault?: string): Observable<IVaultProposalResponseModel> {
    vault = vault || this.vaultAddress;
    if (!!vault === false) return of();
    return this.getItem(`${vault}-proposal-${proposalId}`, this._platformApi.getVaultProposal(vault, proposalId));
  }

  getProposals(request: VaultProposalsFilter, vault?: string): Observable<IVaultProposalsResponseModel> {
    vault = vault || this.vaultAddress;
    if (!!vault === false) return of();
    return this.getItem(`${vault}-proposals-${request.buildQueryString()}`, this._platformApi.getVaultProposals(vault, request))
      .pipe(tap(proposals => proposals.results.forEach(proposal => this.cacheItem(`${vault}-proposal-${proposal.proposalId}`, proposal))));
  }

  getVotes(request: VaultProposalVotesFilter, vault?: string): Observable<IVaultProposalVotesResponseModel> {
    vault = vault || this.vaultAddress;
    if (!!vault === false) return of();
    return this.getItem(`${vault}-votes-${request.buildQueryString()}`, this._platformApi.getVaultProposalVotes(vault, request))
      .pipe(tap(votes => votes.results.forEach(vote => this.cacheItem(`${vault}-${vote.proposalId}-vote-${vote.voter}`, vote))));
  }

  getVote(proposalId: number, voter: string, vault?: string): Observable<IVaultProposalVoteResponseModel> {
    vault = vault || this.vaultAddress;
    if (!!vault === false) return of();
    return this.getItem(`${vault}-${proposalId}-vote-${voter}`, this._platformApi.getVaultProposalVote(vault, proposalId, voter));
  }

  getPledges(request: VaultProposalPledgesFilter, vault?: string): Observable<IVaultProposalPledgesResponseModel> {
    vault = vault || this.vaultAddress;
    if (!!vault === false) return of();
    return this.getItem(`${vault}-pledges-${request.buildQueryString()}`, this._platformApi.getVaultProposalPledges(vault, request))
      .pipe(tap(pledges => pledges.results.forEach(pledge => this.cacheItem(`${vault}-${pledge.proposalId}-pledge-${pledge.pledger}`, pledge))));
  }

  getPledge(proposalId: number, pledger: string, vault?: string): Observable<IVaultProposalPledgeResponseModel> {
    vault = vault || this.vaultAddress;
    if (!!vault === false) return of();
    return this.getItem(`${vault}-${proposalId}-pledge-${pledger}`, this._platformApi.getVaultProposalPledge(vault, proposalId, pledger));
  }
}
