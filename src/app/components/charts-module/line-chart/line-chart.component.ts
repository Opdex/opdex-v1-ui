import { Component, ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IChartData } from '@sharedModels/ui/markets/market-history';
import { ShortNumberPipe } from '@sharedPipes/short-number.pipe';
import { ISeriesApi, DeepPartial, LineWidth, LineData } from 'lightweight-charts';
import { BaseChartComponent } from '../base-chart.component';

@Component({
  selector: 'opdex-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  providers: [ShortNumberPipe]
})
export class LineChartComponent extends BaseChartComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer') container: ElementRef;
  @Input() chartData: IChartData;
  series: ISeriesApi<'Area'>;

  constructor(
    protected _shortNumberPipe: ShortNumberPipe,
    protected _injector: Injector
  ) {
    super(_shortNumberPipe, _injector);
  }

  ngOnInit(): void {
    this._init('lineChartWrapper');
  }

  ngOnChanges(): void {
    setTimeout(() => {
      if (!this.chartData) return;

      const data = [...this.chartData.values] as LineData[];

      if (!this.series) {
        this.addLineSeries();
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

  private addLineSeries(): void {
    this.series = this.chart.addAreaSeries({
      lineColor: 'rgba(71, 188, 235, .6)',
      lineWidth: <DeepPartial<LineWidth>>4,
      topColor: 'rgba(71, 188, 235, .4)',
      bottomColor: 'rgba(71, 188, 235, 0)',
      priceLineVisible: true,
      lastValueVisible: false,
      priceFormat: {
        type: 'custom',
        minMove: 0.00000001,
        formatter: (price: number) =>
          this._priceFormatter(price, this.chartData.labelPrefix, this.chartData.labelSuffix)
      }
    });
  }
}
