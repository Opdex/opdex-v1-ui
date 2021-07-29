import { Observable, BehaviorSubject } from "rxjs";
import { switchMap, shareReplay } from "rxjs/operators";

interface ICacheRecord {
  observable: Observable<any>;
  subject: BehaviorSubject<void>
}

export abstract class CacheService {
  private cache: Record<string, ICacheRecord> = {};

  protected getItem<T>(key: string, $value: Observable<T>): Observable<T> {
    if (!this.cache[key]) {
      this.refreshItem(key);

      this.cache[key].observable = this.cache[key].subject
        .pipe(
          switchMap(_ => $value),
          shareReplay(1)
        );
    }

    return this.cache[key].observable;
  }

  protected refreshItem(key: string): void {
    if (!this.cache[key]) {
      this.cache[key] = {
        subject: new BehaviorSubject<void>(null),
        observable: null
      };
    }

    this.cache[key].subject.next();
  }
}
