import { Component, OnInit } from '@angular/core';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';

@Component({
  selector: 'opdex-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {
  tokens: any[];

  constructor(
    private _platformApiService: PlatformApiService
  ) {

  }

  async ngOnInit(): Promise<void> {
    const tokensResponse = await this._platformApiService.getTokens();
    if (tokensResponse.hasError || tokensResponse.data?.length) {
      // handle
    }

    this.tokens = tokensResponse.data;

    console.log(this.tokens);
  }
}
