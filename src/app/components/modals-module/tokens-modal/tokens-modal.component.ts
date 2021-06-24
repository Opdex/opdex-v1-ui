import { take } from 'rxjs/operators';
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

  constructor(
    private _platformApi: PlatformApiService,
    public dialogRef: MatDialogRef<TokensModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filter = [...data.filter];
  }

  ngOnInit(): void {
    this._platformApi.getTokens()
      .pipe(take(1))
      .subscribe(tokens => {
        this.tokens = tokens.filter(t => !this.filter.includes(t.address) && t.symbol != 'OLPT');
      });
  }

  selectToken(token: any): void {
    this.dialogRef.close(token);
  }
}
