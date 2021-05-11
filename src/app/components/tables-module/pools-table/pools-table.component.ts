import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService } from '@sharedServices/theme.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'opdex-pools-table',
  templateUrl: './pools-table.component.html',
  styleUrls: ['./pools-table.component.scss']
})
export class PoolsTableComponent implements OnChanges, AfterViewInit {
  theme$: Observable<string>;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @Input() pools: any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _themeService: ThemeService, private _router: Router) {
    this.theme$ = this._themeService.getTheme();
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['name', 'liquidity', 'stakingWeight', 'volumeDaily', 'providerRewards', 'stakerRewards', 'liquidityHistory'];
  }

  ngOnChanges() {
    if (!this.pools?.length) return;

    this.dataSource.data = this.pools.map(p => {
      return {
        name: `${p.token.symbol}-CRS`,
        stakingWeight: `376556789.83`,
        providerRewards: '$44,795.94',
        volumeDaily: '$2,133,139',
        stakerRewards: '$14,931,973',
        liquidity: '$4,057,013',
        address: p.address
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/pools/${name}`);
  }

  trackBy(index: number, pool: any) {
    return pool.name + pool.address
  }
}
