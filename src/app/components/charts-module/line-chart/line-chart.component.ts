import { NgZone } from '@angular/core';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { createChart, ISeriesApi, IChartApi, LineWidth, DeepPartial } from 'lightweight-charts';

const garbagePoints = [
  { time: '2019-04-12', value: 79.43 },
  { time: '2019-04-15', value: 78.53 },
  { time: '2019-04-16', value: 77.56 },
  { time: '2019-04-17', value: 73.92 },
  { time: '2019-04-18', value: 73.19 },
  { time: '2019-04-22', value: 73.46 },
  { time: '2019-04-23', value: 74.60 },
  { time: '2019-04-24', value: 74.73 },
  { time: '2019-04-25', value: 76.34 },
  { time: '2019-04-26', value: 76.63 },
  { time: '2019-04-29', value: 76.78 },
  { time: '2019-04-30', value: 78.71 },
  { time: '2019-05-01', value: 78.72 },
  { time: '2019-05-02', value: 79.52 },
  { time: '2019-05-03', value: 80.00 },
  { time: '2019-05-06', value: 79.48 },
  { time: '2019-05-07', value: 77.90 },
  { time: '2019-05-08', value: 78.18 },
  { time: '2019-05-09', value: 78.33 },
  { time: '2019-05-10', value: 78.19 },
  { time: '2019-05-13', value: 77.17 },
  { time: '2019-05-14', value: 77.42 },
  { time: '2019-05-15', value: 77.55 },
  { time: '2019-05-16', value: 79.13 },
  { time: '2019-05-17', value: 78.72 },
  { time: '2019-05-20', value: 78.88 },
  { time: '2019-05-21', value: 79.50 },
  { time: '2019-05-22', value: 80.98 },
  { time: '2019-05-23', value: 81.02 },
  { time: '2019-05-24', value: 81.17 },
  { time: '2019-05-28', value: 81.10 }];
@Component({
  selector: 'opdex-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  @ViewChild('chartContainer') container: ElementRef;
  @Input() title: string;
  @Input() valueKey: string;
  @Input() otherText: string
  @Input() theme: string;
  @Input() chartData: any;
  @Input() type: string;
  lineSeries: ISeriesApi<'Area'>;
  barSeries: ISeriesApi<'Candlestick'>;
  volumeSeries: ISeriesApi<'Histogram'>;
  chart: IChartApi;
  redColor = 'rgba(226, 90, 57, 0.8)';
  greenColor = 'rgba(83, 158, 87, 0.8)';
  loading = true;

  ngOnChanges() {
    this.ngOnInit();

    if (this.chartData) {
      if (this.type === 'Candlestick') {
        if (!this.barSeries) {
          this.barSeries = this.chart.addCandlestickSeries({
            downColor: this.redColor,
            borderDownColor: this.redColor,
            wickDownColor: this.redColor,
            upColor: this.greenColor,
            borderUpColor: this.greenColor,
            wickUpColor: this.greenColor
          });
        }

        this.barSeries.setData(this.chartData);

        if (this.lineSeries) {
          this.chart.removeSeries(this.lineSeries);
          this.lineSeries = <ISeriesApi<'Area'>>{};
        }
      }
      else if (this.type === 'Area') {
        const data: any = garbagePoints.map(point => {
          point.value += 24342272;
          return point;
        });

        // this.chartData.forEach((point: any) => {
        //   data.push({
        //     time: point.time,
        //     value: point.close,
        //     color: '#000'
        //   });
        // });

        if (!this.lineSeries) {
          this.lineSeries = this.chart.addAreaSeries({
            lineColor: 'rgba(71, 188, 235, .7)',
            lineWidth: <DeepPartial<LineWidth>>6,
            // lineStyle: 1,
            // topColor: 'rgba(71, 188, 235, .2)', // Uncomment for gradient affect
            // bottomColor: 'rgba(71, 188, 235, 0)',
            topColor: 'transparent',
            bottomColor: 'transparent',
            priceLineVisible: false,
            lastValueVisible: false
          });
        }

        this.lineSeries.setData(data);

        if (this.barSeries) {
          this.chart.removeSeries(this.barSeries);
          this.lineSeries = <ISeriesApi<'Area'>>{};
        }
      }

      // Volume series no matter which chart type
      this.volumeSeries.setData(this.chartData.map((point:any) => {
        return {
          time: point.time,
          value: point.tradeVolume,
          color: this.theme === 'light-mode'
            ? 'rgba(196, 196, 196, .7)'
            : 'rgba(50, 50, 50, .7)'
        }
      }));

      this.applyChartOptions();



      if (this.loading) {
        this.chart.timeScale().fitContent()
        this.loading = false;
      }
    }
  }

  ngOnInit(): void {
    if (!this.chart) {
      this.chart = createChart('chartdiv', {
        // width: 850,
        height: 300,
        localization: {
          priceFormatter: (price: number) => {
            // return `$${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

            // if (price > 1000000 && price <= 999999999) {
            //   return `$${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            // }

            return this.nFormatter(price, 2);
          }
        },
      });

      this.volumeSeries = this.chart.addHistogramSeries({
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        }
      });
    }
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

  ngAfterViewInit(): void {
    this.onResize();
  }

  private applyChartOptions() {
    this.chart.applyOptions({
      grid: {
        vertLines: {
          color: this.theme === 'dark-mode' ? '#111' : '#f4f4f4',
          style: 1,
          visible: false,
        },
        horzLines: {
          color: this.theme === 'dark-mode' ? '#111' : '#f4f4f4',
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

  onResize() {
    if (this.container) {
      const size = (this.container.nativeElement as HTMLElement).offsetWidth;

      this.chart.resize(size, 350);

      this.chart.timeScale().fitContent();
    }
  }

  ngOnDestroy() {
    this.chart.remove();
  }
}
