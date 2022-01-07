import { IIndexStatus } from '@sharedModels/platform-api/responses/index/index-status.interface';
import { tap, filter } from 'rxjs/operators';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';

@Injectable({ providedIn: 'root' })
export class IndexService {
  private _block: IBlock;
  private _status: IIndexStatus;
  private block$ = new BehaviorSubject<IBlock>(null);
  private status$ = new BehaviorSubject<IIndexStatus>(null);

  constructor(private _platformApi: PlatformApiService) { }

  getLatestBlock() {
    return this._block;
  }

  getLatestBlock$(): Observable<IBlock> {
    return this.block$.asObservable().pipe(filter(block => !!block));
  }

  getStatus() {
    return this._status;
  }

  getStatus$(): Observable<IIndexStatus> {
    return this.status$.asObservable().pipe(filter(status => !!status));
  }

  refreshStatus$(): Observable<IIndexStatus> {
    return this._platformApi.getIndexStatus()
      .pipe(
        tap((status: IIndexStatus) => {
          this._status = status;
          this.status$.next(status);

          if (!this._block || this._block.height < status.latestBlock.height) {
            this._block = status.latestBlock;
            this.block$.next(this._block);
          }
        }));
  }
}
