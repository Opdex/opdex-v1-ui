export enum TransactionSummaryTypes {
  SrcToSrcSwap = 1,
  SrcToCrsSwap = 2,
  CrsToSrcSwap = 3,
  AddLiquidity = 4,
  RemoveLiquidity = 5,
  StartStaking = 6,
  StopStaking = 7,
  StartMining = 8,
  StopMining = 9,
  CollectStakingRewards = 10,
  CollectMiningRewards = 11,
  CreateLiquidityPool = 12,
  CreateMarket = 13,
  SetPendingOwnership = 14,
  ClaimPendingOwnership = 15,
  CreateVaultCertificate = 16,
  RedeemVaultCertificate = 17,
  RevokeVaultCertificate = 18,
  Distribution = 19,
  ChangeMarketPermission = 20,
  EnableMining = 21,
  RewardMiningPool = 22,
  Nomination = 23,
  Approval = 24,
  Transfer = 25
}
