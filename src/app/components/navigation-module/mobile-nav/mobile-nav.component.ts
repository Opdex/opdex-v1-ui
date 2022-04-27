import { AuthService } from '@sharedServices/utility/auth.service';
import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { UserContext } from '@sharedModels/user-context';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'opdex-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent implements OnDestroy {
  @Output() onToggleMenu = new EventEmitter();
  icons = Icons;
  iconSizes = IconSizes;
  context: UserContext;
  subscription = new Subscription();

  constructor(
    private _userContextService: UserContextService,
    private _authService: AuthService
  ) {
    this.subscription.add(
      this._userContextService.context$
        .subscribe(context => this.context = context));
  }

  login(): void {
    this._authService.prepareLogin();
  }

  toggleMenu() {
    this.onToggleMenu.emit();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
