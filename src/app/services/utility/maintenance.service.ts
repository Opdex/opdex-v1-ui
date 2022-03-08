import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class MaintenanceService {
  private _maintenance$ = new BehaviorSubject<boolean>(false);

  public get maintenance$(): Observable<boolean> {
    return this._maintenance$.asObservable();
  }

  public setMaintenance(isActive: boolean): void {
    this._maintenance$.next(isActive);
  }
}
