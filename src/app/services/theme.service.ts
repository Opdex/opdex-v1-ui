import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';
import { StorageService } from './utility/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme$: BehaviorSubject<string>;
  private themeKey = 'theme';

  constructor(private _db: StorageService) {
    const defaultTheme = this._db.getLocalStorage<string>(this.themeKey, false) || environment.defaultTheme;
    this.theme$ = new BehaviorSubject(defaultTheme);
  }

  getTheme(): Observable<string> {
    return this.theme$.asObservable();
  }

  setTheme(theme: string): void {
    this._db.setLocalStorage(this.themeKey, theme, false);
    this.theme$.next(theme);
  }
}
