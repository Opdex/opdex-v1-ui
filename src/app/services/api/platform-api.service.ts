import { VaultProposals } from '@sharedModels/ui/vaults/vault-proposals';
import { VaultProposal } from '@sharedModels/ui/vaults/vault-proposal';
import { VaultProposalPledges } from '@sharedModels/ui/vaults/vault-proposal-pledges';
import { VaultProposalVotes } from '@sharedModels/ui/vaults/vault-proposal-votes';
import { VaultProposalVote } from '@sharedModels/ui/vaults/vault-proposal-vote';
import { VaultProposalPledge } from '@sharedModels/ui/vaults/vault-proposal-pledge';
import { VaultCertificates } from '@sharedModels/ui/vaults/vault-certificates';
import { Vault } from '@sharedModels/ui/vaults/vault';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Market } from '@sharedModels/ui/markets/market';
import { MarketTokens } from '@sharedModels/ui/tokens/market-tokens';
import { Tokens } from '@sharedModels/ui/tokens/tokens';
import { LiquidityPools } from '@sharedModels/ui/liquidity-pools/liquidity-pools';
import { Token } from '@sharedModels/ui/tokens/token';
import { map } from 'rxjs/operators';
import { MiningPositionsFilter } from '@sharedModels/platform-api/requests/wallets/mining-positions-filter';
import { TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { IMarketToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IAddressMiningPositions } from '@sharedModels/platform-api/responses/wallets/address-mining.interface';
import { IAddressMining } from '@sharedModels/platform-api/responses/wallets/address-mining.interface';
import { IAddressStaking, IAddressStakingPositions } from '@sharedModels/platform-api/responses/wallets/address-staking.interface';
import { IMarket } from '@sharedModels/platform-api/responses/markets/market.interface';
import { IMiningGovernance, IMiningGovernances } from '@sharedModels/platform-api/responses/mining-governances/mining-governance.interface';
import { IAddressBalance, IAddressBalances } from '@sharedModels/platform-api/responses/wallets/address-balance.interface';
import { Router } from '@angular/router';
import { JwtService } from '@sharedServices/utility/jwt.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { ErrorService } from '@sharedServices/utility/error.service';
import { Observable } from 'rxjs';
import { ILiquidityPoolsResponse, ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { LiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { TransactionRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { ITransactionReceipt, ITransactionReceipts } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { IAddressAllowanceResponse } from '@sharedModels/platform-api/responses/wallets/address-allowance.interface';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IVaultCertificates } from '@sharedModels/platform-api/responses/vaults/vault-certificate.interface';
import { IMiningQuote } from '@sharedModels/platform-api/requests/mining-pools/mining-quote';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { IMiningPool, IMiningPools } from '@sharedModels/platform-api/responses/mining-pools/mining-pool.interface';
import { IApproveAllowanceRequest } from '@sharedModels/platform-api/requests/tokens/approve-allowance-request';
import { ICreateLiquidityPoolRequest } from '@sharedModels/platform-api/requests/liquidity-pools/create-liquidity-pool-request';
import { IStartStakingRequest } from '@sharedModels/platform-api/requests/liquidity-pools/start-staking-request';
import { IStopStakingRequest } from '@sharedModels/platform-api/requests/liquidity-pools/stop-staking-request';
import { ICollectStakingRewardsRequest } from '@sharedModels/platform-api/requests/liquidity-pools/collect-staking-rewards-request';
import { IAddLiquidityRequest } from '@sharedModels/platform-api/requests/liquidity-pools/add-liquidity-request';
import { IRemoveLiquidityRequest } from '@sharedModels/platform-api/requests/liquidity-pools/remove-liquidity-request';
import { IAddLiquidityAmountInQuoteRequest } from '@sharedModels/platform-api/requests/quotes/add-liquidity-amount-in-quote-request';
import { IRewardMiningPoolsRequest } from '@sharedModels/platform-api/requests/mining-governances/reward-mining-pools-request';
import { ITransactionQuoteRequest } from '@sharedModels/platform-api/requests/transactions/transaction-quote-request';
import { ISwapRequest } from '@sharedModels/platform-api/requests/tokens/swap-request';
import { IAddTokenRequest } from '@sharedModels/platform-api/requests/tokens/add-token-request';
import { ISwapAmountOutQuoteResponse } from '@sharedModels/platform-api/responses/tokens/swap-amount-out-quote-response.interface';
import { ISwapAmountInQuoteResponse } from '@sharedModels/platform-api/responses/tokens/swap-amount-in-quote-response.interface';
import { ISwapAmountInQuoteRequest } from '@sharedModels/platform-api/requests/tokens/swap-amount-in-quote-request';
import { ISwapAmountOutQuoteRequest } from '@sharedModels/platform-api/requests/tokens/swap-amount-out-quote-request';
import { IMarketTokensResponse } from '@sharedModels/platform-api/responses/tokens/market-tokens-response.interface';
import { ITokensResponse } from '@sharedModels/platform-api/responses/tokens/tokens-response.interface';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { ITokenHistoryResponse } from '@sharedModels/platform-api/responses/tokens/token-history-response.interface';
import { HistoryFilter } from '@sharedModels/platform-api/requests/history-filter';
import { IMarketHistoryResponse } from '@sharedModels/platform-api/responses/markets/market-history-response.interface';
import { ILiquidityPoolSnapshotHistoryResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-snapshots-responses.interface';
import { IProvideAmountInResponse } from '@sharedModels/platform-api/responses/liquidity-pools/provide-amount-in-response.interface';
import { IMinimumPledgeVaultProposalQuoteRequest } from '@sharedModels/platform-api/requests/vaults/minimum-pledge-vault-proposal-quote-request.interface';
import { IMinimumVoteVaultProposalQuoteRequest } from '@sharedModels/platform-api/requests/vaults/minimum-vote-vault-proposal-quote-request.interface';
import { IVaultProposalWithdrawPledgeQuoteRequest } from '@sharedModels/platform-api/requests/vaults/vault-proposal-withdraw-pledge-quote-request.interface';
import { IVaultProposalWithdrawVoteQuoteRequest } from '@sharedModels/platform-api/requests/vaults/vault-proposal-withdraw-vote-quote-request.interface';
import { IVaultProposalVoteQuoteRequest } from '@sharedModels/platform-api/requests/vaults/vault-proposal-vote-quote-request.interface';
import { IVaultProposalPledgeQuoteRequest } from '@sharedModels/platform-api/requests/vaults/vault-proposal-pledge-quote-request.interface';
import { IRevokeCertificateVaultProposalQuoteRequest } from '@sharedModels/platform-api/requests/vaults/revoke-certificate-vault-proposal-quote-request.interface';
import { ICreateCertificateVaultProposalQuoteRequest } from '@sharedModels/platform-api/requests/vaults/create-certificate-vault-proposal-quote-request.interface';
import { IVaultResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-response-model.interface';
import { IVaultProposalResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-response-model.interface';
import { IVaultProposalPledgeResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-pledge-response-model.interface';
import { IVaultProposalVoteResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-vote-response-model.interface';
import { VaultProposalsFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposals-filter';
import { IVaultProposalsResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposals-response-model.interface';
import { IVaultProposalPledgesResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-pledges-response-model.interface';
import { IVaultProposalVotesResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-votes-response-model.interface';
import { VaultCertificatesFilter } from '@sharedModels/platform-api/requests/vaults/vault-certificates-filter';
import { IIndexStatus } from '@sharedModels/platform-api/responses/index/index-status.interface';
import { WalletBalancesFilter } from '@sharedModels/platform-api/requests/wallets/wallet-balances-filter';
import { StakingPositionsFilter } from '@sharedModels/platform-api/requests/wallets/staking-positions-filter';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { MarketToken } from '@sharedModels/ui/tokens/market-token';

@Injectable({
  providedIn: 'root'
})
export class PlatformApiService extends RestApiService {
  private api: string;
  private marketAddress: string;

  constructor(
    protected _http: HttpClient,
    protected _error: ErrorService,
    protected _jwt: JwtService,
    protected _router: Router,
    protected _context: UserContextService,
    private _env: EnvironmentsService
  ) {
    super(_http, _error, _jwt, _context, _router);
    this.api = this._env.apiUrl;
    this.marketAddress = this._env.marketAddress;
  }

  ////////////////////////////
  // Indexer
  ////////////////////////////

  public getIndexStatus(): Observable<IIndexStatus> {
    const endpoint = `${this.api}/indexer`;
    return this.get<IIndexStatus>(endpoint);
  }


  ////////////////////////////
  // Market Tokens
  ////////////////////////////

  public getMarketToken(address: string): Observable<MarketToken> {
    const endpoint = `${this.api}/markets/${this.marketAddress}/tokens/${address}`;
    return this.get<IMarketToken>(endpoint).pipe(map(token => new MarketToken(token)));
  }

  public getMarketTokens(request: TokensFilter): Observable<MarketTokens> {
    const endpoint = `${this.api}/markets/${this.marketAddress}/tokens${request.buildQueryString()}`;
    return this.get<IMarketTokensResponse>(endpoint).pipe(map(tokens => new MarketTokens(tokens)));
  }

  public getMarketTokenHistory(tokenAddress: string, request: HistoryFilter): Observable<ITokenHistoryResponse> {
    const endpoint = `${this.api}/markets/${this.marketAddress}/tokens/${tokenAddress}/history${request.buildQueryString()}`;
    return this.get<ITokenHistoryResponse>(endpoint);
  }

  public swapQuote(address: string, payload: ISwapRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/markets/${this.marketAddress}/tokens/${address}/swap`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  public swapAmountInQuote(tokenIn: string, payload: ISwapAmountInQuoteRequest): Observable<ISwapAmountInQuoteResponse> {
    const endpoint = `${this.api}/markets/${this.marketAddress}/tokens/${tokenIn}/swap/amount-in`;
    return this.post<ISwapAmountInQuoteResponse>(endpoint, payload);
  }

  public swapAmountOutQuote(tokenOut: string, payload: ISwapAmountOutQuoteRequest): Observable<ISwapAmountOutQuoteResponse> {
    const endpoint = `${this.api}/markets/${this.marketAddress}/tokens/${tokenOut}/swap/amount-out`;
    return this.post<ISwapAmountOutQuoteResponse>(endpoint, payload);
  }

  ////////////////////////////
  // Tokens
  ////////////////////////////

  public getTokens(request: TokensFilter): Observable<Tokens> {
    const endpoint = `${this.api}/tokens${request.buildQueryString()}`;
    return this.get<ITokensResponse>(endpoint).pipe(map(tokens => new Tokens(tokens)));
  }

  public getToken(address: string): Observable<Token> {
    const endpoint = `${this.api}/tokens/${address}`;
    return this.get<IToken>(endpoint).pipe(map(token => new Token(token)));
  }

  public addToken(payload: IAddTokenRequest): Observable<Token> {
    const endpoint = `${this.api}/tokens`;
    return this.post<IToken>(endpoint, payload).pipe(map(token => new Token(token)));
  }

  public getTokenHistory(tokenAddress: string, request: HistoryFilter): Observable<ITokenHistoryResponse> {
    const endpoint = `${this.api}/tokens/${tokenAddress}/history${request.buildQueryString()}`;
    return this.get<ITokenHistoryResponse>(endpoint);
  }

  public approveAllowanceQuote(address: string, payload: IApproveAllowanceRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/tokens/${address}/approve`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  public distributeTokensQuote(address: string): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/tokens/${address}/distribute`;
    return this.post<ITransactionQuote>(endpoint, {});
  }


  ////////////////////////////
  // Liquidity Pools
  ////////////////////////////

  public createLiquidityPool(payload: ICreateLiquidityPoolRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/liquidity-pools`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  public getPool(address: string): Observable<LiquidityPool> {
    const endpoint = `${this.api}/liquidity-pools/${address}`;
    return this.get<ILiquidityPoolResponse>(endpoint).pipe(map(pool => new LiquidityPool(pool)));
  }

  public getLiquidityPools(query?: LiquidityPoolsFilter): Observable<LiquidityPools> {
    const endpoint = `${this.api}/liquidity-pools${query.buildQueryString()}`;
    return this.get<ILiquidityPoolsResponse>(endpoint).pipe(map(pools => new LiquidityPools(pools)));
  }

  public getLiquidityPoolHistory(address: string, request: HistoryFilter): Observable<ILiquidityPoolSnapshotHistoryResponse> {
    const endpoint = `${this.api}/liquidity-pools/${address}/history${request.buildQueryString()}`;
    return this.get<ILiquidityPoolSnapshotHistoryResponse>(endpoint);
  }

  public startStakingQuote(address: string, payload: IStartStakingRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/liquidity-pools/${address}/staking/start`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  public stopStakingQuote(address: string, payload: IStopStakingRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/liquidity-pools/${address}/staking/stop`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  public collectStakingRewardsQuote(address: string, payload: ICollectStakingRewardsRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/liquidity-pools/${address}/staking/collect`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  public addLiquidityQuote(address: string, payload: IAddLiquidityRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/liquidity-pools/${address}/add`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  public removeLiquidityQuote(address: string, payload: IRemoveLiquidityRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/liquidity-pools/${address}/remove`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  public quoteAddLiquidity(address: string, payload: IAddLiquidityAmountInQuoteRequest): Observable<IProvideAmountInResponse> {
    const endpoint = `${this.api}/liquidity-pools/${address}/add/amount-in`;
    return this.post<IProvideAmountInResponse>(endpoint, payload);
  }

  ////////////////////////////
  // Mining Pools
  ////////////////////////////

  public getMiningPools(query?: any): Observable<IMiningPools> {
    const endpoint = `${this.api}/mining-pools${query?.getQuery() || ''}`;
    return this.get<IMiningPools>(endpoint);
  }

  public getMiningPool(address: string): Observable<IMiningPool> {
    const endpoint = `${this.api}/mining-pools/${address}`;
    return this.get<IMiningPool>(endpoint);
  }

  public startMiningQuote(address: string, payload: IMiningQuote): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/mining-pools/${address}/start`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  public stopMiningQuote(address: string, payload: IMiningQuote): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/mining-pools/${address}/stop`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  public collectMiningRewardsQuote(address: string): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/mining-pools/${address}/collect`;
    return this.post<ITransactionQuote>(endpoint, {});
  }

  ////////////////////////////
  // Mining Governances
  ////////////////////////////

  public getMiningGovernances(): Observable<IMiningGovernances> {
    const endpoint = `${this.api}/mining-governances`;
    return this.get<IMiningGovernances>(endpoint);
  }

  public getMiningGovernance(address: string): Observable<IMiningGovernance> {
    const endpoint = `${this.api}/mining-governances/${address}`;
    return this.get<IMiningGovernance>(endpoint);
  }

  public rewardMiningPoolsQuote(address: string, payload: IRewardMiningPoolsRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/mining-governances/${address}/reward-mining-pools`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  ////////////////////////////
  // Vaults
  ////////////////////////////

  public getVault(address: string): Observable<Vault> {
    const endpoint = `${this.api}/vaults/${address}`;
    return this.get<IVaultResponseModel>(endpoint).pipe(map(vault => new Vault(vault)));
  }

  public getVaultCertificates(address: string, request: VaultCertificatesFilter): Observable<VaultCertificates> {
    const endpoint = `${this.api}/vaults/${address}/certificates${request.buildQueryString()}`;
    return this.get<IVaultCertificates>(endpoint).pipe(map(certs => new VaultCertificates(certs)));
  }

  public redeemVaultCertificate(vault: string): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/vaults/${vault}/certificates/redeem`;
    return this.post<ITransactionQuote>(endpoint, {});
  }

  public getVaultProposals(address: string, request: VaultProposalsFilter): Observable<VaultProposals> {
    const endpoint = `${this.api}/vaults/${address}/proposals${request.buildQueryString()}`;
    return this.get<IVaultProposalsResponseModel>(endpoint).pipe(map(proposals => new VaultProposals(proposals)));
  }

  public getVaultProposalPledges(address: string, request: any): Observable<VaultProposalPledges> {
    const endpoint = `${this.api}/vaults/${address}/pledges${request.buildQueryString()}`;
    return this.get<IVaultProposalPledgesResponseModel>(endpoint).pipe(map(pledges => new VaultProposalPledges(pledges)));
  }

  public getVaultProposalVotes(address: string, request: any): Observable<VaultProposalVotes> {
    const endpoint = `${this.api}/vaults/${address}/votes${request.buildQueryString()}`;
    return this.get<IVaultProposalVotesResponseModel>(endpoint).pipe(map(votes => new VaultProposalVotes(votes)));
  }

  public getVaultProposal(address: string, proposalId: number): Observable<VaultProposal> {
    const endpoint = `${this.api}/vaults/${address}/proposals/${proposalId}`;
    return this.get<IVaultProposalResponseModel>(endpoint).pipe(map(proposal => new VaultProposal(proposal)));
  }

  public createCertificateVaultProposal(vault: string, request: ICreateCertificateVaultProposalQuoteRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/vaults/${vault}/proposals/create-certificate`;
    return this.post<ITransactionQuote>(endpoint, request);
  }

  public revokeCertificateVaultProposal(vault: string, request: IRevokeCertificateVaultProposalQuoteRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/vaults/${vault}/proposals/revoke-certificate`;
    return this.post<ITransactionQuote>(endpoint, request);
  }

  public minimumPledgeVaultProposal(vault: string, request: IMinimumPledgeVaultProposalQuoteRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/vaults/${vault}/proposals/minimum-pledge`;
    return this.post<ITransactionQuote>(endpoint, request);
  }

  public minimumVoteVaultProposal(vault: string, request: IMinimumVoteVaultProposalQuoteRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/vaults/${vault}/proposals/minimum-vote`;
    return this.post<ITransactionQuote>(endpoint, request);
  }

  public completeVaultProposal(vault: string, proposalId: number): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/vaults/${vault}/proposals/${proposalId}/complete`;
    return this.post<ITransactionQuote>(endpoint, {});
  }

  public getVaultProposalPledge(address: string, proposalId: number, pledger: string): Observable<VaultProposalPledge> {
    const endpoint = `${this.api}/vaults/${address}/proposals/${proposalId}/pledges/${pledger}`;
    return this.get<IVaultProposalPledgeResponseModel>(endpoint).pipe(map(pledge => new VaultProposalPledge(pledge)));
  }

  public pledgeToVaultProposal(vault: string, proposalId: number, request: IVaultProposalPledgeQuoteRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/vaults/${vault}/proposals/${proposalId}/pledges`;
    return this.post<ITransactionQuote>(endpoint, request);
  }

  public withdrawVaultProposalPledge(vault: string, proposalId: number, request: IVaultProposalWithdrawPledgeQuoteRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/vaults/${vault}/proposals/${proposalId}/pledges/withdraw`;
    return this.post<ITransactionQuote>(endpoint, request);
  }

  public getVaultProposalVote(address: string, proposalId: number, voter: string): Observable<VaultProposalVote> {
    const endpoint = `${this.api}/vaults/${address}/proposals/${proposalId}/votes/${voter}`;
    return this.get<IVaultProposalVoteResponseModel>(endpoint).pipe(map(vote => new VaultProposalVote(vote)));
  }

  public voteOnVaultProposal(vault: string, proposalId: number, request: IVaultProposalVoteQuoteRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/vaults/${vault}/proposals/${proposalId}/votes`;
    return this.post<ITransactionQuote>(endpoint, request);
  }

  public withdrawVaultProposalVote(vault: string, proposalId: number, request: IVaultProposalWithdrawVoteQuoteRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/vaults/${vault}/proposals/${proposalId}/votes/withdraw`;
    return this.post<ITransactionQuote>(endpoint, request);
  }

  ////////////////////////////
  // Markets
  ////////////////////////////

  public getMarketOverview(): Observable<Market> {
    const endpoint = `${this.api}/markets/${this.marketAddress}`;
    return this.get<IMarket>(endpoint).pipe(map(market => new Market(market)));
  }

  public getMarketHistory(request: HistoryFilter): Observable<IMarketHistoryResponse> {
    const endpoint = `${this.api}/markets/${this.marketAddress}/history${request.buildQueryString()}`;
    return this.get<IMarketHistoryResponse>(endpoint);
  }

  ////////////////////////////
  // Transactions
  ////////////////////////////

  public getTransactions(request: TransactionRequest): Observable<ITransactionReceipts> {
    const endpoint = `${this.api}/transactions${request.buildQueryString()}`;
    return this.get<ITransactionReceipts>(endpoint);
  }

  public getTransaction(hash: string): Observable<ITransactionReceipt> {
    const endpoint = `${this.api}/transactions/${hash}`;
    return this.get<ITransactionReceipt>(endpoint);
  }

  public replayQuote(payload: ITransactionQuoteRequest): Observable<ITransactionQuote> {
    const endpoint = `${this.api}/transactions/replay-quote`;
    return this.post<ITransactionQuote>(endpoint, payload);
  }

  ////////////////////////////////////////////////////////
  // Wallet Details
  ////////////////////////////////////////////////////////

  public getWalletBalances(wallet: string, request: WalletBalancesFilter): Observable<IAddressBalances> {
    const endpoint = `${this.api}/wallets/${wallet}/balance${request.buildQueryString()}`;
    return this.get<IAddressBalances>(endpoint);
  }

  public getAllowance(owner: string, spender: string, token: string): Observable<IAddressAllowanceResponse> {
    const endpoint = `${this.api}/wallets/${owner}/allowance/${token}/approved/${spender}`;
    return this.get<IAddressAllowanceResponse>(endpoint);
  }

  public getBalance(owner: string, token: string): Observable<IAddressBalance> {
    const endpoint = `${this.api}/wallets/${owner}/balance/${token}`;
    return this.get<IAddressBalance>(endpoint);
  }

  public refreshBalance(owner: string, token: string): Observable<IAddressBalance> {
    const endpoint = `${this.api}/wallets/${owner}/balance/${token}`;
    return this.post<IAddressBalance>(endpoint, {});
  }

  public getStakingPosition(owner: string, liquidityPool: string): Observable<IAddressStaking> {
    const endpoint = `${this.api}/wallets/${owner}/staking/${liquidityPool}`;
    return this.get<IAddressStaking>(endpoint);
  }

  public getMiningPosition(owner: string, miningPool: string): Observable<IAddressMining> {
    const endpoint = `${this.api}/wallets/${owner}/mining/${miningPool}`;
    return this.get<IAddressMining>(endpoint);
  }

  public getMiningPositions(owner: string, request: MiningPositionsFilter): Observable<IAddressMiningPositions> {
    const endpoint = `${this.api}/wallets/${owner}/mining${request.buildQueryString()}`;
    return this.get<IAddressMiningPositions>(endpoint);
  }

  public getStakingPositions(owner: string, request: StakingPositionsFilter): Observable<IAddressStakingPositions> {
    const endpoint = `${this.api}/wallets/${owner}/staking${request.buildQueryString()}`;
    return this.get<IAddressStakingPositions>(endpoint);
  }
}
