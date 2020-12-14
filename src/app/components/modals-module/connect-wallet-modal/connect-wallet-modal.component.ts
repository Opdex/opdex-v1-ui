import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'opdex-connect-wallet-modal',
  templateUrl: './connect-wallet-modal.component.html',
  styleUrls: ['./connect-wallet-modal.component.scss']
})
export class ConnectWalletModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConnectWalletModalComponent>
  ) { }

  ngOnInit(): void { }

  close(navigate: boolean): void {
    this.dialogRef.close(navigate);
  }
}
