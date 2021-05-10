import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ThemeService } from '@sharedServices/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-tokens-table',
  templateUrl: './tokens-table.component.html',
  styleUrls: ['./tokens-table.component.scss']
})
export class TokensTableComponent implements OnChanges, AfterViewInit {
  theme$: Observable<string>;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @Input() tokens: any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _themeService: ThemeService, private _router: Router) {
    this.theme$ = this._themeService.getTheme();
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['name', 'symbol', 'price', 'change'];
  }

  ngOnChanges() {
    if (!this.tokens?.length) return;

    this.dataSource.data = this.tokens.map(t => {
      return {
        name: t.name,
        symbol: t.symbol,
        volumeDaily: '$187,432',
        liquidity: '$1,232,662',
        price: '$0.02',
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
