import { Injector } from '@angular/core';
import { IndexService } from '@sharedServices/platform/index.service';
import { Observable, BehaviorSubject, of } from "rxjs";
import { switchMap, shareReplay, skip } from "rxjs/operators";

interface ICacheRecord {
  observable: Observable<any>;
  subject: BehaviorSubject<void>,
  lastUpdateBlock?: number
}

export abstract class CacheService {
  private _indexService: IndexService;
  private cache: Record<string, ICacheRecord> = {};

  constructor(protected injector: Injector) {
    this._indexService = injector.get(IndexService);
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
   * @param cacheLength Optional number of blocks to cache the record for, default 1.
   * @returns Observable T of the cached items type.
   */
  protected getItem<T>(key: string, $value: Observable<T>, cacheLength: number = 1): Observable<T> {
    const currentBlock = this._indexService.latestBlock;
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

    const blocksSinceRefresh = blockHeight - this.cache[key].lastUpdateBlock;

    // Update, the found record is stale
    if (blocksSinceRefresh >= cacheLength) {
      this.cache[key].lastUpdateBlock = blockHeight;
      this.cache[key].subject.next();

      // Return but skip 1 result, the skipped result will be the initial cached Behavior subject result (stale)
      return this.cache[key].observable.pipe(skip(1));
    }

    // Return cache item observable
    return this.cache[key].observable;
  }

  /**
   * @summary Manually caches an items response. Good to use when retrieving paginated requests to cache the individual records.
   * @param key The key to store the cached item by
   * @param value The generic value to cache
   * @param cacheLength Optional number of blocks to cache the record for, default 1.
   */
  protected cacheItem<T>(key: string, value: T, cacheLength: number = 1): void {
    const currentBlock = this._indexService.latestBlock;
    const blockHeight = currentBlock?.height || 0;

    if (!this.cache[key]) {
      this.cache[key] = {
        subject: new BehaviorSubject<void>(null),
        observable: null,
      };
    }

    this.cache[key].observable = this.cache[key].subject
      .pipe(
        switchMap(_ => of(value)),
        shareReplay(1));

    const blocksSinceRefresh = blockHeight - this.cache[key].lastUpdateBlock;

    if (blocksSinceRefresh >= cacheLength) {
      this.cache[key].lastUpdateBlock = blockHeight;
      this.cache[key].subject.next();
    }
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

    const currentBlock = this._indexService.latestBlock;
    const blockHeight = currentBlock?.height || 0;

    if (blockHeight > this.cache[key].lastUpdateBlock) {
      this.cache[key].subject.next();
    }
  }
}
