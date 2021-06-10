import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { createChart, ISeriesApi, IChartApi, LineWidth, DeepPartial, MouseEventParams } from 'lightweight-charts';

const data = [
  { time: '2019-04-12', value: 7900000.43 },
  { time: '2019-04-15', value: 7800000.53 },
  { time: '2019-04-16', value: 7700000.56 },
  { time: '2019-04-17', value: 7300000.92 },
  { time: '2019-04-18', value: 7300000.19 },
  { time: '2019-04-22', value: 7300000.46 },
  { time: '2019-04-23', value: 7400000.60 },
  { time: '2019-04-24', value: 7400000.73 },
  { time: '2019-04-25', value: 7600000.34 },
  { time: '2019-04-26', value: 7600000.63 },
  { time: '2019-04-29', value: 7600000.78 },
  { time: '2019-04-30', value: 7800000.71 },
  { time: '2019-05-01', value: 7800000.72 },
  { time: '2019-05-02', value: 7900000.52 },
  { time: '2019-05-03', value: 8000000.00 },
  { time: '2019-05-06', value: 7900000.48 },
  { time: '2019-05-07', value: 7700000.90 },
  { time: '2019-05-08', value: 7800000.18 },
  { time: '2019-05-09', value: 7800000.33 },
  { time: '2019-05-10', value: 7800000.19 },
  { time: '2019-05-13', value: 7700000.17 },
  { time: '2019-05-14', value: 7700000.42 },
  { time: '2019-05-15', value: 7700000.55 },
  { time: '2019-05-16', value: 7900000.13 },
  { time: '2019-05-17', value: 7800000.72 },
  { time: '2019-05-20', value: 7800000.88 },
  { time: '2019-05-21', value: 7900000.50 },
  { time: '2019-05-22', value: 8000000.98 },
  { time: '2019-05-23', value: 8100000.02 },
  { time: '2019-05-24', value: 8100000.17 },
  { time: '2019-05-28', value: 8100000.10 }];
@Component({
  selector: 'opdex-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  @ViewChild('chartContainer') container: ElementRef;
  @Input() title: string;
  @Input() chartData: any;
  value: string;
  lineSeries: ISeriesApi<'Area'>;
  chart: IChartApi;
  loading = true;

  ngOnChanges() {
    this.ngOnInit();

    if (this.chartData) {
      if (!this.lineSeries) {
        this.lineSeries = this.chart.addAreaSeries({
          lineColor: 'rgba(71, 188, 235, .7)',
          lineWidth: <DeepPartial<LineWidth>>6,
          topColor: 'transparent',
          bottomColor: 'transparent',
          priceLineVisible: false,
          lastValueVisible: false
        });
      }

      this.lineSeries.setData(data);

      this.applyChartOptions();

      if (this.loading) {
        this.chart.timeScale().fitContent()
        this.loading = false;
        this.setLastBarText();
        this.chart.subscribeCrosshairMove(params => this.crosshairMovedHandler(params));
      }
    }
  }

  ngOnInit(): void {
    if (!this.chart) {
      this.chart = createChart('chartdiv', {
        localization: {
          priceFormatter: (price: number) => {
            return this.nFormatter(price, 2);
          }
        },
      });
    }
  }

  crosshairMovedHandler(param: MouseEventParams): void {
    if ( param === undefined || param.time === undefined || param.point.x < 0 || param.point.y < 0) {
      this.setLastBarText();
    } else {
      this.value = this.nFormatter(param.seriesPrices.values().next().value, 2);
    }
  }

  onResized(event: ResizedEvent) {
    this.chart.resize(event.newWidth, 350);
    this.chart.timeScale().fitContent();
  }

  // Todo: copied from https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
  // Rip out and write our own, using this for short term
  nFormatter(num, digits): string {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
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
    return '$'+(num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  }

  private setLastBarText() {
    this.value = this.nFormatter(data[data.length - 1].value, 2);
  }

  private applyChartOptions() {
    this.chart.applyOptions({
      grid: {
        vertLines: {
          color: '#f4f4f4',
          style: 1,
          visible: false,
        },
        horzLines: {
          color: '#f4f4f4',
          style: 1,
          visible: false,
        },
      },
      layout: {
        // backgroundColor: this.theme === 'dark-mode' ? '#100f1d' : 'transparent',
        backgroundColor: 'transparent',
        textColor: '#f4f4f4',
        fontSize: 14,
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
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
        vertTouchDrag: false
      },
      handleScale: {
        axisPressedMouseMove: false,
        mouseWheel: false,
        pinch: false
      },
    });
  }

  ngOnDestroy() {
    this.chart.remove();
    this.chart.unsubscribeCrosshairMove(this.crosshairMovedHandler);
  }
}
