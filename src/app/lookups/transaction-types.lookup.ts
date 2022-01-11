import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { TransactionView } from "@sharedModels/transaction-view";
import { Icons } from "../enums/icons";

export interface ITransactionType {
  priority: number;
  title: string,
  view?: TransactionView,
  viewRequiresAuth: boolean;
  icon: Icons,
  iconColor: string,
  targetEvents: TransactionEventTypes[];
}

export const TransactionTypes: ITransactionType[] = [
  {
    priority: 0,
    title: 'Swap',
    view: TransactionView.swap,
    viewRequiresAuth: false,
    icon: Icons.swap,
    iconColor: 'swap',
    targetEvents: [TransactionEventTypes.SwapEvent]
  },
  {
    priority: 1,
    title: 'Stake',
    view: TransactionView.stake,
    viewRequiresAuth: false,
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
    viewRequiresAuth: false,
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
    viewRequiresAuth: false,
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
    viewRequiresAuth: true,
    icon: Icons.liquidityPool,
    iconColor: 'swap',
    targetEvents: [TransactionEventTypes.CreateLiquidityPoolEvent]
  },
  {
    priority: 5,
    title: 'Enable Mining',
    view: null,
    viewRequiresAuth: true,
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
    viewRequiresAuth: true,
    icon: Icons.tokens,
    iconColor: 'primary',
    targetEvents: [TransactionEventTypes.DistributionEvent]
  },
  {
    priority: 7,
    title: 'Vault Proposal',
    view: TransactionView.vaultProposal,
    viewRequiresAuth: true,
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
    priority: 8,
    title: 'Vault Certificate',
    view: null,
    viewRequiresAuth: true,
    icon: Icons.receipt,
    iconColor: 'stake',
    targetEvents: [
      TransactionEventTypes.CreateVaultCertificateEvent,
      TransactionEventTypes.RevokeVaultCertificateEvent,
      TransactionEventTypes.RedeemVaultCertificateEvent
    ]
  },
  {
    priority: 9,
    title: 'Ownership',
    view: null,
    viewRequiresAuth: true,
    icon: Icons.owner,
    iconColor: 'swap',
    targetEvents: [
      TransactionEventTypes.SetPendingDeployerOwnershipEvent,
      TransactionEventTypes.SetPendingMarketOwnershipEvent,
      TransactionEventTypes.ClaimPendingDeployerOwnershipEvent,
      TransactionEventTypes.ClaimPendingMarketOwnershipEvent
    ]
  },
  {
    priority: 10,
    title: 'Permissions',
    view: null,
    viewRequiresAuth: true,
    icon: Icons.permissions,
    iconColor: 'primary',
    targetEvents: [TransactionEventTypes.ChangeMarketPermissionEvent]
  },
  {
    priority: 11,
    title: 'Allowance',
    view: TransactionView.allowance,
    viewRequiresAuth: true,
    icon: Icons.approve,
    iconColor: 'provide',
    targetEvents: [TransactionEventTypes.ApprovalEvent]
  }
]
