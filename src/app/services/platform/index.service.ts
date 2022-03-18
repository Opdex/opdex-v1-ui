import { IIndexStatus } from '@sharedModels/platform-api/responses/index/index-status.interface';
import { tap, filter, catchError } from 'rxjs/operators';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';

@Injectable({ providedIn: 'root' })
export class IndexService {
  private _block: IBlock;
  private _status: IIndexStatus;
  private _block$ = new BehaviorSubject<IBlock>(null);
  private _status$ = new BehaviorSubject<IIndexStatus>(null);

  constructor(private _platformApi: PlatformApiService) { }

  public get latestBlock() {
    return this._block;
  }

  public get latestBlock$(): Observable<IBlock> {
    return this._block$.asObservable().pipe(filter(block => !!block));
  }

  public get status(): IIndexStatus {
    return this._status;
  }

  public get status$(): Observable<IIndexStatus> {
    return this._status$.asObservable().pipe(filter(status => !!status));
  }

  refreshStatus$(): Observable<IIndexStatus> {
    return this._platformApi.getIndexStatus()
      .pipe(
        tap((status: IIndexStatus) => {
          this._status = status;
          this._status$.next(status);

          if (!this._block || this._block.height < status.latestBlock.height) {
            this._block = status.latestBlock;
            this._block$.next(this._block);
          }
        }),
        catchError(_ => of({latestBlock: { height: 0 }}) as Observable<IIndexStatus>));
  }
}
