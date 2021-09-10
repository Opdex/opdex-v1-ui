import { CanActivate, CanActivateChild, CanLoad, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private _context: UserContextService,
    private _router: Router
  ) { }

  /**
   * @summary Checks if the current user can activate or view the requested route
   * @param route The route snapshot to check permissions on
   */
  public canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.authorize();
  }

  /**
   * @summary Checks if the current user can activate or view a child of a parent route
   * @param route The route snapshot to check permissions on
   */
  public canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return this.authorize();
  }

  /**
   * @summary Checks if the current user can activate and load a module based on their permissions
   * @param route The route snapshot to check permissions on
   */
  public canLoad(route: any, segments: UrlSegment[]): boolean {
    return this.authorize();
  }

  /**
   * @summary authorizes the current JWT against the route being viewed and permissions required
   * @param data route?.data values which are permissions to check
   */
  private authorize(): boolean {
    // Validate the users JWT
    if (!this._context.getUserContext()?.wallet) {
      return this.fail();
    }

    return true;
  }

  private fail(): boolean {
    this._router.navigateByUrl('/auth');

    return false;
  }
}
