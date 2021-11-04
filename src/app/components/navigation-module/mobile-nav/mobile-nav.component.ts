import { UserContextService } from '@sharedServices/utility/user-context.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
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
  context: any;
  subscription = new Subscription();

  constructor(private _context: UserContextService) {
    this.subscription.add(this._context.getUserContext$().subscribe(context => this.context = context));
  }

  toggleMenu() {
    this.onToggleMenu.emit();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
