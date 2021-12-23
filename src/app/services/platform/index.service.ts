import { IIndexStatus } from '@sharedModels/platform-api/responses/index/index-status.interface';
import { tap, filter } from 'rxjs/operators';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';

@Injectable({ providedIn: 'root' })
export class IndexService {
  private _block: IBlock;
  private block$ = new BehaviorSubject<IBlock>(null);

  constructor(private _platformApi: PlatformApiService) { }

  getLatestBlock() {
    return this._block;
  }

  getLatestBlock$(): Observable<any> {
    return this.block$.asObservable().pipe(filter(block => !!block));
  }

  refreshStatus$(): Observable<IIndexStatus> {
    return this._platformApi.getIndexStatus()
      .pipe(
        tap((status: IIndexStatus) => {
          if (!this._block || this._block.height < status.block.height) {
            this._block = status.block;
            this.block$.next(this._block);
          }
        }));
  }
}
