import { Component } from '@angular/core';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { forkJoin, Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'opdex-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {
  tokens$: Observable<any>;

  constructor(private _tokenService: TokensService) {
    this.tokens$ = this._tokenService.getTokens()
      .pipe(
        switchMap((tokens: any[]) => {
          const poolArray$: Observable<any>[] = [];

          tokens.forEach(token => poolArray$.push(this.getTokenHistory$(token)));

          return forkJoin(poolArray$);
        })
      );
  }

  private getTokenHistory$(token: any): Observable<any> {
    return this._tokenService.getTokenHistory(token.address, "1W")
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
