import { Component } from '@angular/core';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {
  tokens$: Observable<any[]>;

  constructor(private _platformApiService: PlatformApiService) {
    this.tokens$ = this._platformApiService.getTokens();
  }
}
