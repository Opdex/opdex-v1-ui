import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'opdex-tokens-table',
  templateUrl: './tokens-table.component.html',
  styleUrls: ['./tokens-table.component.scss']
})
export class TokensTableComponent implements OnChanges, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @Input() tokens: any[];
  @Input() pageSize: number;
  @Input() smallPageSize: boolean = false;
  pageSizeOptions: number[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['name', 'address', 'symbol', 'price', 'change', 'price7d'];
  }

  ngOnChanges() {
    this.pageSizeOptions = this.smallPageSize ? [5, 10, 25] : [10, 25, 50];

    if (!this.tokens?.length) return;

    this.dataSource.data = this.tokens.map(t => {
      return {
        name: t.name,
        symbol: t.symbol,
        price: t.summary?.price?.close,
        change: t.summary?.dailyPriceChange,
        address: t.address,
        price7d: t.snapshotHistory
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/tokens/${name}`);
  }

  trackBy(index: number, pool: any) {
    return pool.name + pool.address
  }
}
