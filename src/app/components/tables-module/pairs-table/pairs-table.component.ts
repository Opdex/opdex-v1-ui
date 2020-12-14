import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService } from '@sharedServices/theme.service';

@Component({
  selector: 'opdex-pairs-table',
  templateUrl: './pairs-table.component.html',
  styleUrls: ['./pairs-table.component.scss']
})
export class PairsTableComponent implements OnInit {
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
        feesDaily: '$562.29',
        feesWeekly: '$562.29',
        volumeDaily: '$187,432',
        volumeWeekly: '$995,332',
        liquidity: '$1,232,662',
        address: 'asdlkfjasdf'
      }, {
        name: 'GLUON-CRS',
        feesDaily: '$562.29',
        feesWeekly: '$562.29',
        volumeDaily: '$187,432',
        volumeWeekly: '$995,332',
        liquidity: '$1,232,662',
        address: 'asdlkfjasdf'
      }, {
        name: 'WETH-CRS',
        feesDaily: '$562.29',
        feesWeekly: '$562.29',
        volumeDaily: '$187,432',
        volumeWeekly: '$995,332',
        liquidity: '$1,232,662',
        address: 'asdlkfjasdf'
      }, {
        name: 'WBTC-CRS',
        feesDaily: '$562.29',
        feesWeekly: '$562.29',
        volumeDaily: '$187,432',
        volumeWeekly: '$995,332',
        liquidity: '$1,232,662',
        address: 'asdlkfjasdf'
      }, {
        name: 'WUSDT-CRS',
        feesDaily: '$562.29',
        feesWeekly: '$562.29',
        volumeDaily: '$187,432',
        volumeWeekly: '$995,332',
        liquidity: '$1,232,662',
        address: 'asdlkfjasdf'
      }
    ]
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/pairs/${name}`);
  }

  trackBy(index: number, pair: any) {
    return pair.name + pair.address
  }
}
