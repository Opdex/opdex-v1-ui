import { Injector } from '@angular/core';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { Observable, BehaviorSubject } from "rxjs";
import { switchMap, shareReplay } from "rxjs/operators";

interface ICacheRecord {
  observable: Observable<any>;
  subject: BehaviorSubject<void>,
  lastUpdateBlock?: number
}

export abstract class CacheService {
  private _blocksService: BlocksService;
  private cache: Record<string, ICacheRecord> = {};

  constructor(protected injector: Injector) {
    this._blocksService = injector.get(BlocksService);
  }

  /**
   * @summary Clear the cache entirely
   */
  protected clearCache(): void {
    this.cache = {};
  }

  /**
   * @summary Base method to retrieve a sharable cached object.
   * @param key The cached items unique key to look it up by
   * @param $value The api request as observable to use if the cached item doesn't exit.
   * @param cacheOnly default false, optionally only take cached responses or brand new responses if this is the first occurrence of the request.
   * @returns Observable T of the cached items type.
   */
  protected getItem<T>(key: string, $value: Observable<T>, cacheOnly?: boolean): Observable<T> {
    const currentBlock = this._blocksService.getLatestBlock();
    const blockHeight = currentBlock?.height || 0;

    // New up an item if it doesn't yet exist
    if (!this.cache[key]) {
      this.refreshItem(key);

      this.cache[key].lastUpdateBlock = blockHeight;
      this.cache[key].observable = this.cache[key].subject
        .pipe(
          switchMap(_ => $value),
          shareReplay(1)
        );
    }

    // Update the found record is stale
    if (blockHeight > this.cache[key].lastUpdateBlock && !cacheOnly) {
      this.cache[key].lastUpdateBlock = blockHeight;
      this.cache[key].subject.next();
    }

    // Return cache item observable
    return this.cache[key].observable;
  }

  /**
   * @summary Force a refresh to a cached item by key
   * @param key The cached items unique identifier
   */
  protected refreshItem(key: string): void {
    if (!this.cache[key]) {
      this.cache[key] = {
        subject: new BehaviorSubject<void>(null),
        observable: null,
        lastUpdateBlock: 0
      };
    }

    const currentBlock = this._blocksService.getLatestBlock();
    const blockHeight = currentBlock?.height || 0;

    if (blockHeight > this.cache[key].lastUpdateBlock) {
      this.cache[key].subject.next();
    }
  }
}
