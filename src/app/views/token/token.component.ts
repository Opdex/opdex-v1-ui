import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { ThemeService } from '@sharedServices/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
  chartType: string = 'Area';
  ohlcPoints: any[];
  theme$: Observable<string>;
  tokenAddress: string;
  token: any;

  constructor(
    private _themeService: ThemeService,
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService
  ) {
    this.theme$ = this._themeService.getTheme();
    this.tokenAddress = this._route.snapshot.params.token;
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => this.ohlcPoints = [], 100);

    await this.gettoken();
  }

  private async gettoken():Promise<void> {
    const tokenResponse = await this._platformApiService.getToken(this.tokenAddress);
    if (tokenResponse.hasError) {
      //handle
    }

    this.token = tokenResponse.data;
  }
}
