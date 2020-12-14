import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TxBoxSettingsModalComponent } from '../../modals-module/tx-box-settings-modal/tx-box-settings-modal.component';

@Component({
  selector: 'opdex-tx-box-sidebar',
  templateUrl: './tx-box-sidebar.component.html',
  styleUrls: ['./tx-box-sidebar.component.scss']
})
export class TxBoxSidebarComponent {
  @Input() view: string;
  @Output() viewChange = new EventEmitter<string>();

  navigationOptions = [
    { icon: 'swap_horiz', view: 'swap' },
    { icon: 'add', view: 'add' },
    { icon: 'remove', view: 'remove' }];

  constructor(private _dialog: MatDialog) { }

  setView(view: string) {
    this.view = view;
    this.viewChange.emit(this.view);
  }

  openSettingsModal(): void {
    this._dialog.open(TxBoxSettingsModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: ''
    });
  }
}
