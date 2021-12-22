import { IBlock } from "../blocks/block.interface";
import { IIndexLock } from "./index-lock.interface";

export interface IIndexStatus {
  block: IBlock;
  status: IIndexLock;
}
