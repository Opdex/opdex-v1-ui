import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'opdex-tx-provide',
  templateUrl: './tx-provide.component.html',
  styleUrls: ['./tx-provide.component.scss']
})
export class TxProvideComponent implements OnChanges {
  @Input() data: any;
  pool: any;

  ngOnChanges() {
    this.pool = this.data?.pool;
  }
}
