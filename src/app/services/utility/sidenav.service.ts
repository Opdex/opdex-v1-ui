import { Injectable } from '@angular/core';
import { ISidenavMessage, TransactionView } from '@sharedModels/transaction-view';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SidenavService {
  private isOpen: boolean = false;
  private sidenav$: Subject<ISidenavMessage> = new Subject();

  getStatus() {
    return this.sidenav$.asObservable();
  }

  /**
   * @summary Opens the sidebar with the desired component and data
   * @param view The TransactionView to use in the sidebar
   * @param data Any data to be fed to the sidebar
   */
  openSidenav(view: TransactionView, data?: any) {
    this.isOpen = true;
    this.sidenav$.next({ status: this.isOpen, view, data });
  }

  /**
   * @summary Closes the sidenav and kills the component in the sidenav
   */
  closeSidenav() {
    this.isOpen = false;
    this.sidenav$.next({ status: this.isOpen, view: TransactionView.none });
  }
}
