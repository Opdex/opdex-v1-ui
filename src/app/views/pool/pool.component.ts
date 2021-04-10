import { PlatformApiService } from './../../services/api/platform-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'opdex-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
  chartType: string = 'Area';
  ohlcPoints: any[];
  theme$: Observable<string>;
  poolAddress: string;
  pool: any;

  constructor(
    private _themeService: ThemeService,
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService
  ) {
    this.theme$ = this._themeService.getTheme();
    this.poolAddress = this._route.snapshot.params.pool;
  }

  async ngOnInit(): Promise<void> {
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


    const poolResponse = await this._platformApiService.getPool(this.poolAddress);
    if (poolResponse.hasError) {
      //handle
    }

    this.pool = poolResponse.data;
  }

  dateToChartTime(date:Date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0) / 1000;
  };
}
