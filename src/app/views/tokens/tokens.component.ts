import { Component } from '@angular/core';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { forkJoin, Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'opdex-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {
  tokens$: Observable<any>;

  constructor(private _platformApiService: PlatformApiService) {
    this.tokens$ = this._platformApiService.getTokens()
    .pipe(
      switchMap((tokens: any[]) => {
        const poolArray$: Observable<any>[] = [];

        tokens.forEach(token => poolArray$.push(this.getTokenHistory$(token)));

        return forkJoin(poolArray$);
      })
    );
  }

  private getTokenHistory$(token: any): Observable<any> {
    return this._platformApiService.getTokenHistory(token.address)
      .pipe(
        take(1),
        map((tokenHistory: any) => {
          let liquidityPoints: any[] = [];

          tokenHistory.snapshotHistory.forEach(history => {
            liquidityPoints.push({
              time: Date.parse(history.startDate.toString())/1000,
              value: history.price.close
            });
          });

          token.snapshotHistory = liquidityPoints;

          return token;
        }));
  }
}
