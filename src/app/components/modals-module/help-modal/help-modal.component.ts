import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelpInfo } from './help-info';

@Component({
  selector: 'opdex-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent implements OnInit {

  public constructor(
    public dialogRef: MatDialogRef<HelpModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HelpInfo
  ) {}

    
  ngOnInit(): void {
  }

}
