import { UserContextService } from '@sharedServices/user-context.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
  userContext$: Observable<any>;

  constructor(private _context: UserContextService) {
    this.userContext$ = this._context.getUserContext$();
  }
}
