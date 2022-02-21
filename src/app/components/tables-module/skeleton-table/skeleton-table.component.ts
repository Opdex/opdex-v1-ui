import { Icons } from 'src/app/enums/icons';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'opdex-skeleton-table',
  templateUrl: './skeleton-table.component.html',
  styleUrls: ['./skeleton-table.component.scss']
})
export class SkeletonTableComponent {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  icons = Icons;

  constructor() {
    this.dataSource = new MatTableDataSource<any>([ null, null, null, null, null ]);
    this.displayedColumns = ['one', 'two', 'three', 'four', 'five'];
  }
}
