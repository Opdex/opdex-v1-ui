import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';

@Component({
  selector: 'opdex-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
  ohlcPoints = [];
  tokenAddress: string;
  token: any;

  constructor(
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService
  ) {
    this.tokenAddress = this._route.snapshot.params.token;
  }

  ngOnInit(): void {
    this._platformApiService.getToken(this.tokenAddress)
      .pipe(take(1))
      .subscribe(token => this.token = token);
  }
}
