import { BlocksService } from '@sharedServices/platform/blocks.service';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BugReportModalComponent } from '@sharedComponents/modals-module/bug-report-modal/bug-report-modal.component';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Component({
  selector: 'opdex-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent {
  @Output() onMenuToggle = new EventEmitter<boolean>();
  @Input() menuOpen: boolean;
  latestSyncedBlock$: Observable<IBlock>;
  theme$: Observable<string>;
  network: string;

  constructor(
    public dialog: MatDialog,
    private _theme: ThemeService,
    private _blocksService: BlocksService
  ) {
    this.latestSyncedBlock$ = this._blocksService.getLatestBlock$();
    this.theme$ = this._theme.getTheme();
    this.network = environment.network;
  }

  toggleTheme(theme: string) {
    this._theme.setTheme(theme);
  }

  toggleMenu(event: boolean) {
    this.onMenuToggle.emit(event);
    this.menuOpen = event;
  }

  openBugReport(): void {
    this.dialog.open(BugReportModalComponent, {
      width: '500px'
    });
  }
}
