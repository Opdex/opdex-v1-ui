import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class MaintenanceService {
  private _maintenance = false;
  private _maintenance$ = new BehaviorSubject<boolean>(this._maintenance);

  public get maintenance$(): Observable<boolean> {
    return this._maintenance$.asObservable();
  }

  public setMaintenance(isActive: boolean): void {
    if (isActive !== this._maintenance) {
      this._maintenance$.next(isActive);
    }
  }
}
