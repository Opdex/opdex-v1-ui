import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService } from '@sharedServices/theme.service';

@Component({
  selector: 'opdex-pools-table',
  templateUrl: './pools-table.component.html',
  styleUrls: ['./pools-table.component.scss']
})
export class PoolsTableComponent implements OnInit {
  theme$: Observable<string>;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  constructor(private _themeService: ThemeService, private _router: Router) {
    this.theme$ = this._themeService.getTheme();
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['name', 'liquidity', 'volumeDaily', 'volumeWeekly', 'feesDaily', 'feesWeekly'];
  }

  ngOnInit(): void {
    this.dataSource.data = [
      {
        name: 'MEDI-CRS',
        feesDaily: '$6,399.42',
        feesWeekly: '$44,795.94',
        volumeDaily: '$2,133,139',
        volumeWeekly: '$14,931,973',
        liquidity: '$4,057,013',
        address: 'asdlkfjasdf'
      }, {
        name: 'GLUON-CRS',
        feesDaily: '$4,599.42',
        feesWeekly: '$32,195.94',
        volumeDaily: '$1,533,139',
        volumeWeekly: '$10,731,973',
        liquidity: '$3,757,058',
        address: 'asdlkfjasdf'
      }, {
        name: 'WETH-CRS',
        feesDaily: '$7,059.23',
        feesWeekly: '$49,414.61',
        volumeDaily: '$2,353,134',
        volumeWeekly: '$16,471,938',
        liquidity: '$4,319,087',
        address: 'asdlkfjasdf'
      }, {
        name: 'WBTC-CRS',
        feesDaily: '$7,421.83',
        feesWeekly: '$51,952.81',
        volumeDaily: '$2,611,844',
        volumeWeekly: '$18,282,908',
        liquidity: '$4,112,634',
        address: 'asdlkfjasdf'
      }, {
        name: 'WUSDT-CRS',
        feesDaily: '$7,359.73',
        feesWeekly: '$51,518.11',
        volumeDaily: '$2,453,221',
        volumeWeekly: '$17,172,547',
        liquidity: '$4,012,058',
        address: 'asdlkfjasdf'
      }
    ]
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/pools/${name}`);
  }

  trackBy(index: number, pool: any) {
    return pool.name + pool.address
  }
}
