import { Component } from '@angular/core';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-bug-report-modal',
  templateUrl: './bug-report-modal.component.html',
  styleUrls: ['./bug-report-modal.component.scss']
})
export class BugReportModalComponent {
  icons = Icons;
}
