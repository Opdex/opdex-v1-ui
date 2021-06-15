import { SidenavView } from "@sharedModels/sidenav-view";

export const TransactionTypes = [
  {
    id: 1,
    title: 'Swap',
    view: SidenavView.swap
  },
  {
    id: 2,
    title: 'Provide',
    view: SidenavView.pool
  },
  {
    id: 3,
    title: 'Stake',
    view: SidenavView.stake
  },
  {
    id: 4,
    title: 'Mine',
    view: SidenavView.mine
  },
  {
    id: 5,
    title: 'Allowance',
    view: SidenavView.allowance
  },
]
