export interface IIndexLock {
  available: boolean;
  locked: boolean;
  instanceId: string;
  reason: string;
  modifiedDate: Date;
}
