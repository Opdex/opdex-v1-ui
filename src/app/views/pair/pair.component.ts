import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'opdex-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.scss']
})
export class PairComponent implements OnInit {
  chartType: string = 'Area';
  ohlcPoints: any[];
  theme$: Observable<string>;

  constructor(private _themeService: ThemeService) {
    this.theme$ = this._themeService.getTheme();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.ohlcPoints = [
        {
          open: 1,
          high: 3,
          low: 0,
          close: 2,
          time: this.dateToChartTime(new Date(2020, 12, 11))
        },
        {
          open: 2,
          high: 3,
          low: 0,
          close: 3,
          time: this.dateToChartTime(new Date(2020, 12, 12))
        },
        {
          open: 3,
          high: 3,
          low: 0,
          close: 4,
          time: this.dateToChartTime(new Date(2020, 12, 13))
        },
        {
          open: 3,
          high: 3,
          low: 0,
          close: 3,
          time: this.dateToChartTime(new Date(2020, 12, 14))
        },
        {
          open: 3,
          high: 6,
          low: 0,
          close: 6,
          time: this.dateToChartTime(new Date(2020, 12, 15))
        },
        {
          open: 6,
          high: 6,
          low: 0,
          close: 8,
          time: this.dateToChartTime(new Date(2020, 12, 16))
        }
      ];
    }, 100)
  }

  dateToChartTime(date:Date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0) / 1000;
  };
}
