import { take, tap } from 'rxjs/operators';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';

@Injectable({ providedIn: 'root' })
export class BlocksService {
  private _block: IBlock;
  private block$ = new BehaviorSubject<IBlock>(null);

  constructor(private _platformApi: PlatformApiService) { }

  getLatestBlock() {
    return this._block;
  }

  getLatestBlock$(): Observable<any> {
    return this.block$.asObservable();
  }

  refreshLatestBlock(): void {
    this._platformApi.getLatestSyncedBlock()
      .pipe(
        take(1),
        tap((block: IBlock) => {
          if (!this._block || this._block.height < block.height) {
            this._block = block;
            this.block$.next(this._block);
          }
        }))
      .subscribe();
  }
}
