import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { TransactionView } from "@sharedModels/transaction-view";
import { Icons } from "../enums/icons";

export interface ITransactionType {
  priority: number;
  title: string,
  view?: TransactionView,
  icon: Icons,
  iconColor: string,
  targetEvents: TransactionEventTypes[];
}

export const TransactionTypes: ITransactionType[] = [
  {
    priority: 0,
    title: 'Swap',
    view: TransactionView.swap,
    icon: Icons.swap,
    iconColor: 'swap',
    targetEvents: [TransactionEventTypes.SwapEvent]
  },
  {
    priority: 1,
    title: 'Stake',
    view: TransactionView.stake,
    icon: Icons.staking,
    iconColor: 'stake',
    targetEvents: [
      TransactionEventTypes.StartStakingEvent,
      TransactionEventTypes.StopStakingEvent,
      TransactionEventTypes.CollectStakingRewardsEvent,
      TransactionEventTypes.NominationEvent
    ]
  },
  {
    priority: 2,
    title: 'Provide',
    view: TransactionView.provide,
    icon: Icons.provide,
    iconColor: 'provide',
    targetEvents: [
      TransactionEventTypes.AddLiquidityEvent,
      TransactionEventTypes.RemoveLiquidityEvent
    ]
  },
  {
    priority: 3,
    title: 'Mine',
    view: TransactionView.mine,
    icon: Icons.mining,
    iconColor: 'mine',
    targetEvents: [
      TransactionEventTypes.StartMiningEvent,
      TransactionEventTypes.StopMiningEvent,
      TransactionEventTypes.CollectMiningRewardsEvent
    ]
  },
  {
    priority: 4,
    title: 'Create Pool',
    view: TransactionView.createPool,
    icon: Icons.liquidityPool,
    iconColor: 'swap',
    targetEvents: [TransactionEventTypes.CreateLiquidityPoolEvent]
  },
  {
    priority: 5,
    title: 'Enable Mining',
    view: null,
    icon: Icons.refresh,
    iconColor: 'mine',
    targetEvents: [
      TransactionEventTypes.RewardMiningPoolEvent,
      TransactionEventTypes.EnableMiningEvent
    ]
  },
  {
    priority: 6,
    title: 'Distribute',
    view: null,
    icon: Icons.tokens,
    iconColor: 'primary',
    targetEvents: [TransactionEventTypes.DistributionEvent]
  },
  {
    priority: 7,
    title: 'Vault Certificate',
    view: null,
    icon: Icons.receipt,
    iconColor: 'stake',
    targetEvents: [
      TransactionEventTypes.CreateVaultCertificateEvent,
      TransactionEventTypes.RevokeVaultCertificateEvent,
      TransactionEventTypes.RedeemVaultCertificateEvent
    ]
  },
  {
    priority: 8,
    title: 'Vault Proposal',
    view: TransactionView.vaultProposal,
    icon: Icons.proposal,
    iconColor: 'stake',
    targetEvents: [
      TransactionEventTypes.CreateVaultProposalEvent,
      TransactionEventTypes.CompleteVaultProposalEvent,
      TransactionEventTypes.VaultProposalPledgeEvent,
      TransactionEventTypes.VaultProposalWithdrawPledgeEvent,
      TransactionEventTypes.VaultProposalVoteEvent,
      TransactionEventTypes.VaultProposalWithdrawVoteEvent
    ]
  },
  {
    priority: 9,
    title: 'Ownership',
    view: null,
    icon: Icons.owner,
    iconColor: 'swap',
    targetEvents: [
      TransactionEventTypes.SetPendingDeployerOwnershipEvent,
      TransactionEventTypes.SetPendingMarketOwnershipEvent,
      TransactionEventTypes.SetPendingVaultOwnershipEvent,
      TransactionEventTypes.ClaimPendingDeployerOwnershipEvent,
      TransactionEventTypes.ClaimPendingMarketOwnershipEvent,
      TransactionEventTypes.ClaimPendingVaultOwnershipEvent
    ]
  },
  {
    priority: 10,
    title: 'Permissions',
    view: null,
    icon: Icons.permissions,
    iconColor: 'primary',
    targetEvents: [TransactionEventTypes.ChangeMarketPermissionEvent]
  },
  {
    priority: 11,
    title: 'Allowance',
    view: TransactionView.allowance,
    icon: Icons.approve,
    iconColor: 'provide',
    targetEvents: [TransactionEventTypes.ApprovalEvent]
  }
]
