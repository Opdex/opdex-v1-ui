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
    this.displayedColumns = ['name', 'liquidity', 'volume', 'fees'];
  }

  ngOnInit(): void {
    this.dataSource.data = [
      {
        name: 'MEDI',
        fees: '$562.29',
        volume: '$187,432',
        liquidity: '$1,232,662',
        address: 'asdlkfjasdf'
      },
      {
        name: 'GLUON',
        fees: '$562.29',
        volume: '$187,432',
        liquidity: '$1,232,662',
        address: 'asdlkfjasdf'
      },
      {
        name: 'WETH',
        fees: '$562.29',
        volume: '$187,432',
        liquidity: '$1,232,662',
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
