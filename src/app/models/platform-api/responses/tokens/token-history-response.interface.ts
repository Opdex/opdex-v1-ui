import { IPaging } from "../paging.interface";
import { ITokenSnapshot } from "./token.interface";

export interface ITokenHistoryResponse extends IPaging<ITokenSnapshot> {}
