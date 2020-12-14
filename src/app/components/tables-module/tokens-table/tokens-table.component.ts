import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ThemeService } from '@sharedServices/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-tokens-table',
  templateUrl: './tokens-table.component.html',
  styleUrls: ['./tokens-table.component.scss']
})
export class TokensTableComponent implements OnInit {
  theme$: Observable<string>;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  constructor(private _themeService: ThemeService, private _router: Router) {
    this.theme$ = this._themeService.getTheme();
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['name', 'symbol', 'liquidity', 'volumeDaily', 'price', 'change'];
  }

  ngOnInit(): void {
    this.dataSource.data = [
      {
        name: 'MediConnect',
        symbol: 'MEDI',
        volumeDaily: '$187,432',
        liquidity: '$1,232,662',
        price: '$0.02',
        change: '-0.2%',
        address: 'asdlkfjasdf'
      },
      {
        name: 'Gluon',
        symbol: 'GLUON',
        volumeDaily: '$187,432',
        liquidity: '$1,232,662',
        price: '$0.02',
        change: '-0.2%',
        address: 'asdlkfjasdf'
      },
      {
        name: 'Ether (Wrapped)',
        symbol: 'WETH',
        volumeDaily: '$187,432',
        liquidity: '$1,232,662',
        price: '$0.02',
        change: '-0.2%',
        address: 'asdlkfjasdf'
      }
    ]
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/tokens/${name}`);
  }

  trackBy(index: number, pair: any) {
    return pair.name + pair.address
  }
}
