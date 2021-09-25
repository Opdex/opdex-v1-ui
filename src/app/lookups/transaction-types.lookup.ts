import { TransactionView } from "@sharedModels/transaction-view";

export const TransactionTypes = [
  {
    id: 1,
    title: 'Swap',
    view: TransactionView.swap,
    icon: 'swap_horiz',
    iconColor: 'swap'
  },
  {
    id: 2,
    title: 'Provide',
    view: TransactionView.provide,
    icon: 'control_point_duplicate',
    iconColor: 'provide'
  },
  {
    id: 3,
    title: 'Stake',
    view: TransactionView.stake,
    icon: 'verified_user',
    iconColor: 'stake'
  },
  {
    id: 4,
    title: 'Mine',
    view: TransactionView.mine,
    icon: 'whatshot',
    iconColor: 'mine'
  },
  {
    id: 5,
    title: 'Allowance',
    view: TransactionView.allowance,
    icon: 'add',
    iconColor: 'provide'
  },
  {
    id: 6,
    title: 'Create Pool',
    view: TransactionView.createPool,
    icon: 'waves',
    iconColor: 'swap'
  },
]
