import { IBlock } from "../blocks/block.interface";

export interface IIndexStatus {
  block: IBlock;
  available: boolean;
  locked: boolean;
  instanceId: string;
  reason?: string;
  modifiedDate: Date;
}
