import { Component, ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IChartData } from '@sharedModels/ui/markets/market-history';
import { ShortNumberPipe } from '@sharedPipes/short-number.pipe';
import { ISeriesApi, HistogramData } from 'lightweight-charts';
import { BaseChartComponent } from '../base-chart.component';

@Component({
  selector: 'opdex-volume-chart',
  templateUrl: './volume-chart.component.html',
  styleUrls: ['./volume-chart.component.scss'],
  providers: [ShortNumberPipe]
})
export class VolumeChartComponent extends BaseChartComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer') container: ElementRef;
  @Input() chartData: IChartData;
  series: ISeriesApi<'Histogram'>;

  constructor(
    protected _shortNumberPipe: ShortNumberPipe,
    protected _injector: Injector
  ) {
    super(_shortNumberPipe, _injector);
  }

  ngOnInit(): void {
    this._init('volumeChartWrapper');
  }

  ngOnChanges(): void {
    setTimeout(() => {
      if (!this.chartData) return;

      const data = [...this.chartData.values] as HistogramData[];

      if (!this.series) {
        this.addVolumeSeries();
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

  private addVolumeSeries(): void {
    this.series = this.chart.addHistogramSeries({
      priceFormat: {
        type: 'custom',
        minMove: 0.01,
        formatter: (price: number) =>
          this._priceFormatter(price, this.chartData.labelPrefix, this.chartData.labelSuffix)
      },
      color: 'rgba(71, 188, 235, .8)',
      lastValueVisible: false,
      base: 0,
    });
  }
}
