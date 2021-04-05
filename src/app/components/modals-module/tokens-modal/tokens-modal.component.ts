import { MatDialogRef } from '@angular/material/dialog';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'opdex-tokens-modal',
  templateUrl: './tokens-modal.component.html',
  styleUrls: ['./tokens-modal.component.scss']
})
export class TokensModalComponent implements OnInit {
  tokens: any[];

  constructor(private _platformApi: PlatformApiService, public dialogRef: MatDialogRef<TokensModalComponent>) {

  }

  async ngOnInit(): Promise<void> {
    const tokensResponse = await this._platformApi.getTokens();

    if (tokensResponse.hasError) {
      // handle
    }

    this.tokens = [
      {name: 'Cirrus', symbol: 'CRS', address: 'N/A'},
      ...tokensResponse.data
    ];
  }

  selectToken(token: any): void {
    console.log(token);
    this.dialogRef.close(token);
  }
}
