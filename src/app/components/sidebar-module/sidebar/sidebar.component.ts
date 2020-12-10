import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'opdex-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  theme$: Observable<string>;

  constructor(private _theme: ThemeService) {
    this.theme$ = this._theme.getTheme();
  }

  ngOnInit(): void { }

  setTheme(theme: string) {
    this._theme.setTheme(theme);
  }
}
