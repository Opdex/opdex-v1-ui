import { Subscription } from 'rxjs';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { createChart, ISeriesApi, IChartApi, LineWidth, DeepPartial } from 'lightweight-charts';
import { tap } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'opdex-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
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

  constructor(private _theme: ThemeService, private _breakpointObserver: BreakpointObserver) {
    this.subscription.add(this._theme.getTheme()
      .pipe(tap(theme => {
        this.theme = theme

        if (this.chart) {
          this.applyChartOptions();
        }
      })).subscribe());

      this.subscription.add(
        this._breakpointObserver
          .observe(['(min-width: 992px)'])
          .subscribe((result: BreakpointState) => {
            this.height = result.matches ? 400 : 275;

            if (this.chart) {
              this.chart.resize(this.width, this.height);
            }
          }));
  }

  ngOnChanges() {
    this.ngOnInit();

    if (this.chartData && this.chartOptions) {
      if (!this.lineSeries) {
        this.lineSeries = this.chart.addAreaSeries({
          lineColor: 'rgba(71, 188, 235, .7)',
          lineWidth: <DeepPartial<LineWidth>>6,
          topColor: 'transparent',
          bottomColor: 'transparent',
          priceLineVisible: true,
          lastValueVisible: false,
          priceFormat: {
            type: 'custom',
            minMove: 0.00000001,
            formatter: price => this.nFormatter(price, this.selectedChart.decimals > 8 ? 8 : this.selectedChart.decimals)
          },
          scaleMargins : {
            top: 1,
            bottom: 99
          },
        });
      }

      if (!this.volumeSeries) {
        this.volumeSeries = this.chart.addHistogramSeries({
          priceFormat: {
            type: 'custom',
            minMove: 0.00000001,
            formatter: price => this.nFormatter(price,  this.selectedChart.decimals > 8 ? 8 : this.selectedChart.decimals)
          },
          color: 'rgba(71, 188, 235, .8)',
          lastValueVisible: false,
          base: 0,
        });
      }

      if (!this.candleSeries) {
        this.candleSeries = this.chart.addCandlestickSeries({
          lastValueVisible: false,
          priceLineVisible: false,
          priceFormat: {
            type: 'custom',
            minMove: 0.00000001,
            formatter: price => this.nFormatter(price,  this.selectedChart.decimals > 8 ? 8 : this.selectedChart.decimals)
          }
        });
      }

      this.applyChartOptions();

      if (this.chartOptions && this.selectedChart.type === 'line') {
        this.lineSeries.setData(this.chartData);
        this.volumeSeries.setData([])
        this.candleSeries.setData([])
      } else if (this.chartOptions && this.selectedChart.type === 'bar') {
        this.volumeSeries.setData(this.chartData);
        this.lineSeries.setData([]);
        this.candleSeries.setData([]);
      } else if (this.chartOptions && this.selectedChart.type === 'candle') {
        this.candleSeries.setData(this.chartData);
        this.lineSeries.setData([]);
        this.volumeSeries.setData([]);
      }

      if (this.loading) {
        // this.chart.subscribeCrosshairMove(params => this.crosshairMovedHandler(params));
      }

      this.setLastBarText();
      this.chart.timeScale().fitContent()
      this.loading = false;
    }
  }

  ngOnInit(): void {
    if (!this.chart) {
      this.chart = createChart('chartdiv');
    }
  }

  switchChartType(value: string) {
    this.onTypeChange.emit(value);
  }

  timeChange(value: string) {
    this.onTimeChange.emit(value);
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

  onResized(event: ResizedEvent) {
    if (this.chart) {
      this.width = event.newWidth;
      this.chart.resize(event.newWidth, this.height);
      this.chart.timeScale().fitContent();
    }
  }

  // Todo: copied from https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
  // Rip out and write our own, using this for short term
  nFormatter(num, digits): string {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "B" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }

    let prefix = this.selectedChart.prefix || '';
    let suffix = this.selectedChart.suffix || '';
    return prefix+(num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol+ ' ' +suffix;
  }

  private setLastBarText() {
    if (this.chartData && this.chartData.length > 0) {
      const data = this.chartData[this.chartData.length - 1]
      const value = data?.close !== undefined ? data.close : data.value;
      const decimals = this.selectedChart.decimals > 8 ? 8 : this.selectedChart.decimals;

      this.value = this.nFormatter(value,  decimals);
    }
  }

  private applyChartOptions() {
    this.chart.applyOptions({
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
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
        borderVisible: false
      },
      handleScroll: false,
      handleScale: false
    });
  }

  ngOnDestroy() {
    this.chart.remove();
    // this.chart.unsubscribeCrosshairMove(this.crosshairMovedHandler);
    this.subscription.unsubscribe();
  }
}
