import { IChartData } from '@sharedModels/ui/markets/market-history';
import { ISeriesApi, BarData } from 'lightweight-charts';
import { Component, OnInit, OnDestroy, OnChanges, Injector, ElementRef, ViewChild, Input } from '@angular/core';
import { BaseChartComponent } from '../base-chart.component';
import { ShortNumberPipe } from '@sharedPipes/short-number.pipe';

@Component({
  selector: 'opdex-candle-chart',
  templateUrl: './candle-chart.component.html',
  styleUrls: ['./candle-chart.component.scss'],
  providers: [ShortNumberPipe]
})
export class CandleChartComponent extends BaseChartComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer') container: ElementRef;
  @Input() chartData: IChartData;
  series: ISeriesApi<'Candlestick'>;

  constructor(
    protected _shortNumberPipe: ShortNumberPipe,
    protected _injector: Injector
  ) {
    super(_shortNumberPipe, _injector);
  }

  ngOnInit(): void {
    this._init('candleChartWrapper');
  }

  ngOnChanges(): void {
    setTimeout(() => {
      if (!this.chartData) return;

      const data = [...this.chartData.values] as BarData[];

      if (!this.series) {
        this.addCandleStickSeries();
        this.series.setData(data);
        this.chart.timeScale().fitContent();
        this.loading = false;
      } else {
        this.series.setData(data);
      }
    }, 200);
  }

  ngOnDestroy(): void {
    this.chart.removeSeries(this.series);
    this.chart.remove();
    this.baseSubscription.unsubscribe();
  }

  private addCandleStickSeries() {
    this.series = this.chart.addCandlestickSeries({
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: {
        type: 'custom',
        minMove: 0.00000001,
        formatter: (price: number) =>
          this._priceFormatter(price, this.chartData.labelPrefix, this.chartData.labelSuffix)
      }
    });
  }
}
