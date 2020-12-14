import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'opdex-tx-box-settings-modal',
  templateUrl: './tx-box-settings-modal.component.html',
  styleUrls: ['./tx-box-settings-modal.component.scss']
})
export class TxBoxSettingsModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TxBoxSettingsModalComponent>
  ) { }

  ngOnInit(): void { }

  close(navigate: boolean): void {
    this.dialogRef.close(navigate);
  }
}
