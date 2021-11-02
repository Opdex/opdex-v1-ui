import { Network } from 'src/app/enums/networks';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { Icons } from 'src/app/enums/icons';
import { environment } from '@environments/environment';

@Component({
  selector: 'opdex-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnDestroy {
  @Output() onPinnedToggle = new EventEmitter<boolean>();
  @Output() onRouteChanged = new EventEmitter<string>();
  userContext$: Observable<any>;
  isPinned: boolean = true;
  theme$: Subscription;
  theme: 'light-mode' | 'dark-mode';
  latestSyncedBlock$: Observable<IBlock>;
  icons = Icons;
  iconSizes = IconSizes;
  network: string;

  constructor(
    private _context: UserContextService,
    private _theme: ThemeService,
    private _blocksService: BlocksService,
  ) {
    this.userContext$ = this._context.getUserContext$();
    this.theme$ = this._theme.getTheme().subscribe((theme: 'light-mode' | 'dark-mode') => this.theme = theme);
    this.latestSyncedBlock$ = this._blocksService.getLatestBlock$();
    this.network = environment.network;
  }

  toggleTheme() {
    this.theme = this.theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    this._theme.setTheme(this.theme);
  }

  togglePin() {
    this.isPinned = !this.isPinned;
    this.onPinnedToggle.emit(this.isPinned);
  }

  emitRouteChange(url: string) {
    this.onRouteChanged.emit(url);
  }

  ngOnDestroy() {
    if (this.theme$) this.theme$.unsubscribe();
  }
}
