export enum TransactionEventTypes {
  // Market deployer logs
  CreateMarketEvent = 'CreateMarketEvent',
  SetPendingDeployerOwnershipEvent = 'SetPendingDeployerOwnershipEvent',
  ClaimPendingDeployerOwnershipEvent = 'ClaimPendingDeployerOwnershipEvent',

  // Market logs
  CreateLiquidityPoolEvent = 'CreateLiquidityPoolEvent',
  SetPendingMarketOwnershipEvent = 'SetPendingMarketOwnershipEvent',
  ClaimPendingMarketOwnershipEvent = 'ClaimPendingMarketOwnershipEvent',
  ChangeMarketPermissionEvent = 'ChangeMarketPermissionEvent',

  // Liquidity pool logs
  AddLiquidityEvent = 'AddLiquidityEvent',
  RemoveLiquidityEvent = 'RemoveLiquidityEvent',
  SwapEvent = 'SwapEvent',
  StartStakingEvent = 'StartStakingEvent',
  StopStakingEvent = 'StopStakingEvent',
  CollectStakingRewardsEvent = 'CollectStakingRewardsEvent',

  // Mining pool logs
  StartMiningEvent = 'StartMiningEvent',
  StopMiningEvent = 'StopMiningEvent',
  CollectMiningRewardsEvent = 'CollectMiningRewardsEvent',
  EnableMiningEvent = 'EnableMiningEvent',

  // Tokens
  ApprovalEvent = 'ApprovalEvent',
  TransferEvent = 'TransferEvent',
  DistributionEvent = 'DistributionEvent',

  // Mining governance logs
  RewardMiningPoolEvent = 'RewardMiningPoolEvent',
  NominationEvent = 'NominationEvent',

  // Vaults
  CreateVaultCertificateEvent = 'CreateVaultCertificateEvent',
  RevokeVaultCertificateEvent = 'RevokeVaultCertificateEvent',
  RedeemVaultCertificateEvent = 'RedeemVaultCertificateEvent',
  CreateVaultProposalEvent = 'CreateVaultProposalEvent',
  CompleteVaultProposalEvent = 'CompleteVaultProposalEvent',
  VaultProposalPledgeEvent = 'VaultProposalPledgeEvent',
  VaultProposalWithdrawPledgeEvent = 'VaultProposalWithdrawPledgeEvent',
  VaultProposalVoteEvent = 'VaultProposalVoteEvent',
  VaultProposalWithdrawVoteEvent = 'VaultProposalWithdrawVoteEvent',
}

export function txEventConverter(value: string): TransactionEventTypes {
  return (<any>TransactionEventTypes)[value];
}
