import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  constructor(private _router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['action', 'value', 'amount0', 'amount1', 'wallet', 'time'];
  }

  ngOnInit(): void {
    this.dataSource.data = [
      {
        action: 'Swap xBTC for CRS',
        value: '$562.29',
        amount0: '187,432 xBTC',
        amount1: '1,232,662 CRS',
        wallet: 'PG5bGZgPJ4XCfGnDAQ5Di73CFu8YN4fHgB',
        time: new Date()
      },
      {
        action: 'Swap CRS for xBTC',
        value: '$562.29',
        amount0: '187,432 CRS',
        amount1: '1,232,662 xBTC',
        wallet: 'PG5bGZgPJ4XCfGnDAQ5Di73CFu8YN4fHgB',
        time: new Date()
      },
      {
        action: 'Remove CRS and xBTC',
        value: '$562.29',
        amount0: '187,432 CRS',
        amount1: '1,232,662 xBTC',
        wallet: 'PG5bGZgPJ4XCfGnDAQ5Di73CFu8YN4fHgB',
        time: new Date()
      }
    ]
  }

  navigate(name: string) {
    // this._router.navigateByUrl(`/tokens/${name}`);
  }

  trackBy(index: number, pool: any) {
    return pool.name + pool.address
  }
}
