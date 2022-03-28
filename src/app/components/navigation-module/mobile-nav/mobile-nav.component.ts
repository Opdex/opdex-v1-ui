import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
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
  useNewAuthFlow: boolean;

  constructor(
    private _context: UserContextService,
    private _env: EnvironmentsService
  ) {
    this.subscription.add(
      this._context.getUserContext$()
        .subscribe(context => this.context = context));

    this.useNewAuthFlow = this._env.useNewAuthFlow;
  }

  toggleMenu() {
    this.onToggleMenu.emit();
  }

  login():void {
    window.location.href = this._env.authRoute;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
