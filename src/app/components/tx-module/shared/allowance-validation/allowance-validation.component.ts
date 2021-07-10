import { SidenavService } from '@sharedServices/sidenav.service';
import { Component, Input } from '@angular/core';
import { TransactionView } from '@sharedModels/transaction-view';

@Component({
  selector: 'opdex-allowance-validation',
  templateUrl: './allowance-validation.component.html',
  styleUrls: ['./allowance-validation.component.scss']
})
export class AllowanceValidationComponent {
  @Input() allowance: any;

  constructor(private _sidenav: SidenavService) { }

  approveAllowance(amount: string, spender: string, token: string) {
    this._sidenav.openSidenav(TransactionView.allowance, { amount, spender, token });
  }
}
