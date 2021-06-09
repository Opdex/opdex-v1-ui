import { Injectable } from '@angular/core';
import { ISidenavMessage, SidenavView } from '@sharedModels/sidenav-view';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SidenavService {
  private isOpen: boolean = false;
  private sidenav$: Subject<ISidenavMessage> = new Subject();

  constructor() { }

  getStatus() {
    return this.sidenav$.asObservable();
  }

  // Todo: Right now the sidenav must be explicitly opened or closed
  // The below function is a starter to being able to toggle the sidenav but
  // it's not complete or tested. The toggle portion works as expected (open|close)
  // but if you have a student sidenav open, then _toggle_ notifications sidenav
  // The sidenav will close rather than stay open and switch to the notifications view.

  // toggleSidenav(view: SidenavView, data?: any) {
  //   this.isOpen = !this.isOpen;
  //   this.sidenav$.next({ status: this.isOpen, view, data });
  // }

  /**
   * @summary Opens the sidebar with the desired component and data
   * @param view The SidenavView to use in the sidebar
   * @param data Any data to be fed to the sidebar
   */
  openSidenav(view: SidenavView, data?: any) {
    this.isOpen = true;
    this.sidenav$.next({ status: this.isOpen, view, data });
  }

  /**
   * @summary Closes the sidenav and kills the component in the sidenav
   */
  closeSidenav() {
    this.isOpen = false;
    this.sidenav$.next({ status: this.isOpen, view: SidenavView.none });
  }
}
