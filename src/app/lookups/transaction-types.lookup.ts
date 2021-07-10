import { TransactionView } from "@sharedModels/transaction-view";

export const TransactionTypes = [
  {
    id: 1,
    title: 'Swap',
    view: TransactionView.swap
  },
  {
    id: 2,
    title: 'Provide',
    view: TransactionView.provide
  },
  {
    id: 3,
    title: 'Stake',
    view: TransactionView.stake
  },
  {
    id: 4,
    title: 'Mine',
    view: TransactionView.mine
  },
  {
    id: 5,
    title: 'Allowance',
    view: TransactionView.allowance
  },
]
