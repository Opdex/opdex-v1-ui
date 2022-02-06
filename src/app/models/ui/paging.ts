import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';

export class Paging {
  private _next: string;
  private _previous: string;

  public get next(): string {
    return this._next;
  }

  public get previous(): string {
    return this._previous;
  }

  constructor(paging: ICursor) {
    this._next = paging.next;
    this._previous = paging.previous;
  }
}
