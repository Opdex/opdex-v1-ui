import { IBlockResponse } from './../Blocks/block-response.interface';

export interface ITransactionResponse {
  hash: string;
  from: string;
  to: string;
  newContractAddress?: string;
  gasUsed: number;
  block: IBlockResponse;
  success: boolean;
  events: ITransactionEventResponse[];
}

export interface ITransactionEventResponse {
  sortOrder: number;
  eventType: string;
  contract: string;
}

interface IChangeOwnerResponse {
  from: string;
  to: string;
}

// Deployers
export interface IDeployerChangeOwnerEventResponse extends ITransactionEventResponse, IChangeOwnerResponse { }

export interface ICreateMarketEventResponse extends ITransactionEventResponse {
  market: string;
  owner: string;
  router: string;
  authPoolCreators: boolean;
  authProviders: boolean;
  authTraders: boolean;
  transactionFee: number;
  stakingToken: string;
  enableMarketFee: boolean;
}

// Market Events
export interface IMarketChangeOwnerEventResponse extends ITransactionEventResponse, IChangeOwnerResponse { }

export interface ICreateLiquidityPoolEventResponse extends ITransactionEventResponse {
  liquidityPool: string;
  token: string;
}

export interface IChangeMarketPermissionEventResponse extends ITransactionEventResponse {
  address: string;
  permission: string;
  isAuthorized: boolean;
}

// Liquidity Pool Events
export interface ISwapEventResponse extends ITransactionEventResponse {
  amountCrsIn: string;
  amountSrcIn: string;
  amountCrsOut: string;
  amountSrcOut: string;
  sender: string;
  to: string;
}

export interface IProvideEventResponse extends ITransactionEventResponse {
  amountCrs: string;
  amountSrc: string;
  amountLpt: string;
  subEventType: string;
}

export interface IStakeEventResponse extends ITransactionEventResponse {
  staker: string;
  amount: string;
  subEventType: string;
}

export interface ICollectStakingRewardsEventResponse extends ITransactionEventResponse {
  staker: string;
  reward: string;
}

// Mining Pool Events
export interface IEnableMiningEventResponse extends ITransactionEventResponse {
  amount: string;
  rewardRate: string;
  miningPeriodEndBlock: number;
}

export interface IMineEventResponse extends ITransactionEventResponse {
  miner: string;
  amount: string;
  subEventType: string;
}

export interface ICollectMiningRewardsEventResponse extends ITransactionEventResponse {
  miner: string;
  amount: string;
}

// Token Events
export interface ITransferEventResponse extends ITransactionEventResponse {
  from: string;
  to: string;
  amount: string;
}

export interface IApprovalEventResponse extends ITransactionEventResponse {
  owner: string;
  spender: string;
  amount: string;
}

export interface IDistributionEventResponse extends ITransactionEventResponse {
  vaultAmount: string;
  miningAmount: string;
  periodIndex: number;
}

// Governance Events
export interface INominationEventResponse extends ITransactionEventResponse {
  stakingPool: string;
  miningPool: string;
  weight: string;
}

export interface IRewardMiningPoolEventResponse extends ITransactionEventResponse {
  stakingPool: string;
  miningPool: string;
  amount: string;
}

// Vault Events
export interface IVaultChangeOwnerEventResponse extends ITransactionEventResponse, IChangeOwnerResponse { }

export interface ICreateVaultCertificateEventResponse extends ITransactionEventResponse {
  holder: string;
  amount: string;
  vestedBlock: number;
}

export interface IRedeemVaultCertificateEventResponse extends ITransactionEventResponse {
  holder: string;
  amount: string;
  vestedBlock: number;
}

export interface IRevokeVaultCertificateEventResponse extends ITransactionEventResponse {
  holder: string;
  oldAmount: string;
  newAmount: string;
  vestedBlock: number;
}
