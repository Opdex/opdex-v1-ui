import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ThemeService } from '@sharedServices/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {
  theme$: Observable<string>;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  constructor(private _themeService: ThemeService, private _router: Router) {
    this.theme$ = this._themeService.getTheme();
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['action', 'value', 'amount0', 'amount1', 'wallet', 'time'];
  }

  ngOnInit(): void {
    this.dataSource.data = [
      {
        action: 'Swap MEDI for CRS',
        value: '$562.29',
        amount0: '187,432 MEDI',
        amount1: '1,232,662 CRS',
        wallet: 'asdlkfjasdf',
        time: new Date()
      },
      {
        action: 'Swap CRS for MEDI',
        value: '$562.29',
        amount0: '187,432 CRS',
        amount1: '1,232,662 MEDI',
        wallet: 'asdlkfjasdf',
        time: new Date()
      },
      {
        action: 'Remove CRS and MEDI',
        value: '$562.29',
        amount0: '187,432 CRS',
        amount1: '1,232,662 MEDI',
        wallet: 'asdlkfjasdf',
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
