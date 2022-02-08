import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { Paging } from "./paging";

export class PagingResults<T> {
  private _results: T[];
  private _paging: Paging

  public get results(): T[] {
    return this._results;
  }

  public get paging(): Paging {
    return this._paging;
  }

  constructor(results: T[], paging: ICursor) {
    this._results = results;
    this._paging = new Paging(paging);
  }
}
