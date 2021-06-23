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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['name', 'address', 'symbol', 'price', 'change', 'price7d'];
  }

  ngOnChanges() {
    if (!this.tokens?.length) return;

    this.dataSource.data = this.tokens.map(t => {
      return {
        name: t.name,
        symbol: t.symbol,
        price: t.summary?.price?.close || 0.25,
        change: '-0.2%',
        address: t.address
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
