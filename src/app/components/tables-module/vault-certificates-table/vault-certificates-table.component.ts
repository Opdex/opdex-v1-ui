import { IVaultCertificate } from '@sharedModels/responses/platform-api/vaults/vault-certificate.interface';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'opdex-vault-certificates-table',
  templateUrl: './vault-certificates-table.component.html',
  styleUrls: ['./vault-certificates-table.component.scss']
})
export class VaultCertificatesTableComponent implements OnChanges {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @Input() certificates: IVaultCertificate[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['owner', 'amount', 'revoked', 'redeemed', 'vestingStart', 'vestingEnd'];
  }

  ngOnChanges() {
    this.dataSource.data = this.certificates;
  }

  trackBy(index: number, pool: any) {
    return pool.name + pool.address
  }
}
