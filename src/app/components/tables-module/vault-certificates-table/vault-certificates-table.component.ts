import { VaultCertificates } from '@sharedModels/ui/vaults/vault-certificates';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Icons } from 'src/app/enums/icons';
import { VaultCertificate } from '@sharedModels/ui/vaults/vault-certificate';

@Component({
  selector: 'opdex-vault-certificates-table',
  templateUrl: './vault-certificates-table.component.html',
  styleUrls: ['./vault-certificates-table.component.scss']
})
export class VaultCertificatesTableComponent implements OnChanges {
  @Input() certificates: VaultCertificates;

  displayedColumns: string[];
  dataSource: MatTableDataSource<VaultCertificate>;
  previous: string;
  next: string;
  icons = Icons;
  loading: boolean;

  @Output() onPageChange: EventEmitter<string> = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    this.loading = true;
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['owner', 'amount', 'revoked', 'redeemed', 'vestingStart', 'vestingEnd'];
  }

  ngOnChanges() {
    if (this.certificates) {
      this.dataSource.data = this.certificates.results;
      this.next = this.certificates.paging.next;
      this.previous = this.certificates.paging.previous;
      this.loading = false;
    }
  }

  pageChange(cursor: string) {
    this.onPageChange.emit(cursor);
  }

  trackBy(index: number, certificate: VaultCertificate) {
    return `${index}-${certificate?.trackBy}`;
  }
}
