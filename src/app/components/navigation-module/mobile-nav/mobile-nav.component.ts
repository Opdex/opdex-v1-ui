import { Component } from '@angular/core';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent {
  userContext$: Observable<any>;

  constructor(private _context: UserContextService) {
    this.userContext$ = this._context.getUserContext$();
  }
}
