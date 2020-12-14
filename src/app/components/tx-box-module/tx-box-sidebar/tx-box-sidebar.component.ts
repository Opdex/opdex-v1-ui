import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  setView(view: string) {
    this.view = view;
    this.viewChange.emit(this.view);
  }
}
