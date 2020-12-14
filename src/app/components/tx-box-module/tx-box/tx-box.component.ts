import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@sharedServices/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-tx-box',
  templateUrl: './tx-box.component.html',
  styleUrls: ['./tx-box.component.scss']
})
export class TxBoxComponent implements OnInit {
  theme$: Observable<string>;
  view: string = 'swap'; // Can be swap, add, or remove

  constructor(private _themeService: ThemeService) {
    this.theme$ = this._themeService.getTheme();
  }

  ngOnInit(): void { }
}
