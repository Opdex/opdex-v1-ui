import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'opdex-tokens-modal',
  templateUrl: './tokens-modal.component.html',
  styleUrls: ['./tokens-modal.component.scss']
})
export class TokensModalComponent implements OnInit {
  tokens: any[];
  filter: string[] = [];

  constructor(private _platformApi: PlatformApiService, public dialogRef: MatDialogRef<TokensModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.filter = [...data.filter];
  }

  async ngOnInit(): Promise<void> {
    const tokensResponse = await this._platformApi.getTokens();

    if (tokensResponse.hasError) {
      // handle
    }

    this.tokens = tokensResponse.data.filter(t => !this.filter.includes(t.address));
  }

  selectToken(token: any): void {
    this.dialogRef.close(token);
  }
}
