export enum SidenavView {
  none,
  swap,
  pool,
  stake,
  mine
}

export interface ISidenavMessage {
  status: boolean;
  view: SidenavView;
  data?: any;
}
