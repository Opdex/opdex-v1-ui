import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'opdex-vault-certificates-table',
  templateUrl: './vault-certificates-table.component.html',
  styleUrls: ['./vault-certificates-table.component.scss']
})
export class VaultCertificatesTableComponent implements OnChanges, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @Input() certificates: any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['wallet', 'amount', 'vestingStart', 'vestingEnd'];
  }

  ngOnInit() {
    if (!this.certificates?.length) {
      this.certificates = [
        {
          wallet: 'PTsyKGQJ3eD9jnhHZKtvDmCMyGVMNTHay6',
          amount: '2500000.00000000', // 2.5 Million,
          vestingStart: 2943823,
          vestingEnd: 4943823,
        },
        {
          wallet: 'PBLTVXkgeCpGx2p7HQ5ojgvK8mFAroSVVn',
          amount: '10000000.00000000', // 10 Million,
          vestingStart: 2256836,
          vestingEnd: 4256836,
        },
        {
          wallet: 'PTsyKGQJ3eD9jnhHZKtvDmCMyGVMNTHay6',
          amount: '2500000.00000000', // 2.5 Million,
          vestingStart: 2943823,
          vestingEnd: 4943823,
        },
        {
          wallet: 'PBLTVXkgeCpGx2p7HQ5ojgvK8mFAroSVVn',
          amount: '10000000.00000000', // 10 Million,
          vestingStart: 2256836,
          vestingEnd: 4256836,
        },
        {
          wallet: 'PTsyKGQJ3eD9jnhHZKtvDmCMyGVMNTHay6',
          amount: '2500000.00000000', // 2.5 Million,
          vestingStart: 2943823,
          vestingEnd: 4943823,
        },
        {
          wallet: 'PBLTVXkgeCpGx2p7HQ5ojgvK8mFAroSVVn',
          amount: '10000000.00000000', // 10 Million,
          vestingStart: 2256836,
          vestingEnd: 4256836,
        },
        {
          wallet: 'PTsyKGQJ3eD9jnhHZKtvDmCMyGVMNTHay6',
          amount: '2500000.00000000', // 2.5 Million,
          vestingStart: 2943823,
          vestingEnd: 4943823,
        },
        {
          wallet: 'PBLTVXkgeCpGx2p7HQ5ojgvK8mFAroSVVn',
          amount: '10000000.00000000', // 10 Million,
          vestingStart: 2256836,
          vestingEnd: 4256836,
        }
      ]
    };

    this.dataSource.data = this.certificates;
  }

  ngOnChanges() {
    this.dataSource.data = this.certificates;
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
