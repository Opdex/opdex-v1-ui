export enum TransactionView {
  none = 0,
  swap = 1,
  provide = 2,
  stake = 3,
  mine = 4,
  allowance = 5,
  createPool = 6
}

export interface ISidenavMessage {
  status: boolean;
  view: TransactionView;
  data?: any;
}
