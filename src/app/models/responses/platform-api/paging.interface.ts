import { ICursor } from "./cursor.interface";

export interface IPaging<T> {
  results: T[];
  paging: ICursor
}
