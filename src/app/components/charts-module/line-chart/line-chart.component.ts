import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { ShortNumberPipe } from '@sharedPipes/short-number.pipe';
import { Subscription } from 'rxjs';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { createChart, ISeriesApi, IChartApi, LineWidth, DeepPartial } from 'lightweight-charts';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';

@Component({
  selector: 'opdex-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  providers: [ShortNumberPipe]
})
export class LineChartComponent implements OnChanges, OnInit {
  @ViewChild('chartContainer') container: ElementRef;
  @Input() title: string;
  @Input() chartData: any;
  @Input() showTimeSpans: boolean = true;
  @Input() selectedChart: any;
  @Input() chartOptions: any[];
  @Output() onTypeChange = new EventEmitter<string>();
  @Output() onTimeChange = new EventEmitter<string>();
  value: string = '';
  lineSeries: ISeriesApi<'Area'>;
  volumeSeries: ISeriesApi<'Histogram'>;
  candleSeries: ISeriesApi<'Candlestick'>;
  chart: IChartApi;
  loading = true;
  chartType: any;
  theme: string;
  subscription = new Subscription();
  height: number = 400;
  width: number;
  icons = Icons;
  iconSizes = IconSizes;
  locked = true;

  constructor(private _theme: ThemeService, private _breakpointObserver: BreakpointObserver, private _shortNumber: ShortNumberPipe) {
    this.subscription.add(this._theme.getTheme()
      .pipe(tap(theme => {
        this.theme = theme

        if (this.chart) {
          this.applyChartOptions();
        }
      })).subscribe());

      this.subscription.add(
        this._breakpointObserver
          .observe(['(min-width: 992px)', '(min-width: 1440px)'])
          .subscribe((result: BreakpointState) => {

            if (result.breakpoints['(min-width: 1440px)']) {
              this.height = 500;
            } else if (result.breakpoints['(min-width: 992px)']) {
              this.height = 400;
            } else {
              this.height = 275;
            }

            if (this.chart) {
              this.chart.resize(this.width, this.height);
            }
          }));
  }

  ngOnChanges() {
    if (this.chartData !== null && this.chartData !== undefined && this.selectedChart) {
      // Timeouts required for smooth loading w/ fade
      setTimeout(() => {
        if (this.chartOptions && this.selectedChart.type === 'line') {
          this.clearSeries();
          this.addLineSeries();
          this.lineSeries.setData(this.chartData);
        } else if (this.chartOptions && this.selectedChart.type === 'bar') {
          this.clearSeries();
          this.addVolumeSeries();
          this.volumeSeries.setData(this.chartData);
        } else if (this.chartOptions && this.selectedChart.type === 'candle') {
          this.clearSeries();
          this.addCandleStickSeries();
          this.candleSeries.setData(this.chartData);
        }

        this.applyChartOptions();

        if (this.loading) {
          this.chart.timeScale().fitContent();
          // this.chart.subscribeCrosshairMove(params => this.crosshairMovedHandler(params));
        }

        this.setLastBarText();
        this.loading = false;
      });
    }
  }

  ngOnInit(): void {
    // Timeouts required for smooth loading w/ fade
    setTimeout(() => {
      if (!this.chart) {
        this.chart = createChart('chartdiv', this.options);
      }
    })
  }

  toggleLock() {
    this.locked = !this.locked;
  }

  switchChartType(value: string) {
    this.onTypeChange.emit(value);
  }

  timeChange(value: string) {
    this.onTimeChange.emit(value);
    this.loading = true;
  }

  private clearSeries() {
    if (this.lineSeries) {
      this.chart.removeSeries(this.lineSeries);
      this.lineSeries.setData([]);
      this.lineSeries = null;
    }

    if (this.volumeSeries) {
      this.chart.removeSeries(this.volumeSeries);
      this.volumeSeries.setData([]);
      this.volumeSeries = null;
    }

    if (this.candleSeries) {
      this.chart.removeSeries(this.candleSeries);
      this.candleSeries.setData([]);
      this.candleSeries = null;
    }
  }

  private addLineSeries() {
    this.lineSeries = this.chart.addAreaSeries({
      lineColor: 'rgba(71, 188, 235, .6)',
      lineWidth: <DeepPartial<LineWidth>>4,
      topColor: 'rgba(71, 188, 235, .5)',
      priceLineVisible: true,
      lastValueVisible: false,
      priceFormat: {
        type: 'custom',
        minMove: 0.01,
        formatter: (price: string) => this.priceFormatter(price)
      }
    });
  }

  private addCandleStickSeries() {
    this.candleSeries = this.chart.addCandlestickSeries({
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: {
        type: 'custom',
        minMove: 0.00000001,
        formatter: (price: string) => this.priceFormatter(price)
      }
    });
  }

  private addVolumeSeries() {
    this.volumeSeries = this.chart.addHistogramSeries({
      priceFormat: {
        type: 'custom',
        minMove: 0.01,
        formatter: (price: string) => this.priceFormatter(price)
      },
      color: 'rgba(71, 188, 235, .8)',
      lastValueVisible: false,
      base: 0,
    });
  }

  private priceFormatter(price: string): string {
    if (price.toString().startsWith('-')) return '';

    const newPrice = new FixedDecimal(price, this.selectedChart.decimals > 8 ? 8 : this.selectedChart.decimals);
    const shortNumber = this._shortNumber.transform(newPrice.formattedValue);

    if (shortNumber == 'NAN') return '';

    return `${this.selectedChart.prefix || ''}${shortNumber}`;
  }

  onResized(event: ResizedEvent) {
    if (this.chart !== undefined) {
      this.width = event.newRect.width;
      this.chart.resize(event.newRect.width, this.height);
      this.chart.timeScale().fitContent();
    }
  }

  private setLastBarText() {
    if (this.chartData && this.chartData.length > 0) {
      const data = this.chartData[this.chartData.length - 1]
      const value = data?.close !== undefined ? data.close : data.value;

      this.value = typeof value === 'number' ? value.toFixed(this.selectedChart.decimals) : value;
    }
  }

  private applyChartOptions() {
    this.chart.applyOptions(this.options);

    if (this.lineSeries) {
      this.lineSeries.applyOptions({
        bottomColor: this.theme === 'light-mode' ? 'rgba(255, 255, 255, .4)' : 'rgba(0, 0, 0, .1)',
      })
    }
  }

  public get options() {
    return {
      grid: {
        vertLines: {
          visible: true,
          color: this.theme === 'light-mode' ? '#f1f1f1' : '#111125'
        },
        horzLines: {
          visible: true,
          color: this.theme === 'light-mode' ? '#f1f1f1' : '#111125'
        },
      },
      layout: {
        backgroundColor: 'transparent',
        textColor: this.theme === 'light-mode' ? '#222' : '#f4f4f4',
        fontSize: 12,
        fontFamily: 'Arial'
      },
      timeScale: {
        visible: true,
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false
      },
      rightPriceScale: {
        borderVisible: false,
        alignLabels: true,
      },
      handleScroll: true,
      handleScale: true
    }
  }

  // crosshairMovedHandler(param: MouseEventParams): void {
  //   if (param === undefined || param.time === undefined || param.point.x < 0 || param.point.y < 0) {
  //     this.setLastBarText();
  //   } else {
  //     const data = param.seriesPrices.values().next().value;
  //     const value = data?.close !== undefined ? data.close : data;
  //     const decimals = this.selectedChart.decimals > 8 ? 8 : this.selectedChart.decimals

  //     this.value = this.nFormatter(value,  decimals);
  //   }
  // }

  ngOnDestroy() {
    this.chart.remove();
    this.subscription.unsubscribe();
    // this.chart.unsubscribeCrosshairMove(this.crosshairMovedHandler);
  }
}
