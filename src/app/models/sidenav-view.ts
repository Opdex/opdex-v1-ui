export enum SidenavView {
  none = 0,
  swap = 1,
  pool = 2,
  stake = 3,
  mine = 4,
  allowance = 5
}

export interface ISidenavMessage {
  status: boolean;
  view: SidenavView;
  data?: any;
}
