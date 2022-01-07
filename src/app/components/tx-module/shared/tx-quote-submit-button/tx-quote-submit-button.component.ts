import { SidenavService } from './../../../../services/utility/sidenav.service';
import { SideNavComponent } from './../../../navigation-module/side-nav/side-nav.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-quote-submit-button',
  templateUrl: './tx-quote-submit-button.component.html',
  styleUrls: ['./tx-quote-submit-button.component.scss']
})
export class TxQuoteSubmitButtonComponent {
  @Input() disabled: boolean;
  @Input() warn: boolean;
  @Output() onSubmit = new EventEmitter();
  context: any;
  icons = Icons;
  iconSizes = IconSizes;
  subscription = new Subscription();

  constructor(
    private _context: UserContextService,
    private _router: Router,
    private _sidebarService: SidenavService
  ) {
    this.subscription.add(
      this._context.getUserContext$()
        .pipe(tap(context => this.context = context))
        .subscribe());
  }

  connectWallet(): void {
    this._router.navigateByUrl('/auth');
    this._sidebarService.closeSidenav();
  }

  submit(): void {
    this.onSubmit.emit();
  }
}
