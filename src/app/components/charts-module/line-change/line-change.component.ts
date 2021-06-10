import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { createChart, DeepPartial, IChartApi, ISeriesApi, LineWidth } from 'lightweight-charts';

const up = [
  { time: '2019-04-12', value: 79.43 },
  { time: '2019-04-15', value: 78.53 },
  // { time: '2019-04-16', value: 77.56 },
  // { time: '2019-04-17', value: 73.92 },
  { time: '2019-04-18', value: 73.19 },
  // { time: '2019-04-22', value: 73.46 },
  // { time: '2019-04-23', value: 74.60 },
  { time: '2019-04-24', value: 74.73 },
  // { time: '2019-04-25', value: 76.34 },
  // { time: '2019-04-26', value: 76.63 },
  { time: '2019-04-29', value: 76.78 },
  // { time: '2019-04-30', value: 78.71 },
  // { time: '2019-05-01', value: 78.72 },
  { time: '2019-05-02', value: 79.52 },
  { time: '2019-05-03', value: 80.00 },
  // { time: '2019-05-06', value: 79.48 },
  { time: '2019-05-07', value: 77.90 },
  // { time: '2019-05-08', value: 78.18 },
  // { time: '2019-05-09', value: 78.33 },
  { time: '2019-05-10', value: 78.19 },
  // { time: '2019-05-13', value: 77.17 },
  // { time: '2019-05-14', value: 77.42 },
  { time: '2019-05-15', value: 77.55 },
  // { time: '2019-05-16', value: 79.13 },
  // { time: '2019-05-17', value: 78.72 },
  { time: '2019-05-20', value: 78.88 },
  { time: '2019-05-21', value: 79.50 },
  // { time: '2019-05-22', value: 80.98 },
  { time: '2019-05-23', value: 81.02 },
  // { time: '2019-05-24', value: 81.17 },
  { time: '2019-05-28', value: 81.10 }
];

const down = [
  { time: '2019-04-12', value: 79.43 },
  { time: '2019-04-15', value: 78.53 },
  { time: '2019-04-16', value: 77.56 },
  // { time: '2019-04-17', value: 73.92 },
  // { time: '2019-04-18', value: 73.19 },
  // { time: '2019-04-22', value: 73.46 },
  { time: '2019-04-23', value: 74.60 },
  // { time: '2019-04-24', value: 74.73 },
  // { time: '2019-04-25', value: 76.34 },
  // { time: '2019-04-26', value: 76.63 },
  { time: '2019-04-29', value: 76.78 },
  // { time: '2019-04-30', value: 78.71 },
  { time: '2019-05-01', value: 78.72 },
  { time: '2019-05-02', value: 79.52 },
  // { time: '2019-05-03', value: 80.00 },
  { time: '2019-05-06', value: 79.48 },
  // { time: '2019-05-07', value: 77.90 },
  // { time: '2019-05-08', value: 78.18 },
  { time: '2019-05-09', value: 78.33 },
  // { time: '2019-05-10', value: 78.19 },
  { time: '2019-05-13', value: 77.17 },
  // { time: '2019-05-14', value: 77.42 },
  // { time: '2019-05-15', value: 77.55 },
  // { time: '2019-05-16', value: 79.13 },
  { time: '2019-05-17', value: 78.72 },
  { time: '2019-05-20', value: 77.88 },
  // { time: '2019-05-21', value: 75.50 },
  { time: '2019-05-22', value: 76.98 },
  // { time: '2019-05-23', value: 78.02 },
  // { time: '2019-05-24', value: 77.17 },
  { time: '2019-05-28', value: 75.10 }
];

@Component({
  selector: 'opdex-line-change',
  templateUrl: './line-change.component.html',
  styleUrls: ['./line-change.component.scss']
})
export class LineChangeComponent implements AfterViewInit {
  @ViewChild('chartPreview') container: ElementRef;
  @Input() chartData: any;
  type: string = 'Area';
  lineSeries: ISeriesApi<'Area'>;
  chart: IChartApi;
  redColor = 'rgba(242, 67, 91, 0.8)';
  greenColor = 'rgba(0, 235, 147, 0.8)';
  loading = true;
  id = `${Math.random()}-chart`;
  points = Math.random() > .5 ? up : down;

  ngAfterViewInit(): void {
    if (!this.chart) {
      this.chart = createChart(this.id, {
        width: 150,
        height: 50
      });

      if (this.chartData || this.points.length) {
        if (!this.lineSeries) {
          this.lineSeries = this.chart.addAreaSeries({
            lineColor: this.points[0].value > this.points[this.points.length - 1].value ? this.redColor : this.greenColor,
            lineWidth: <DeepPartial<LineWidth>>4,
            topColor: 'transparent',
            bottomColor: 'transparent',
            priceLineVisible: false,
            lastValueVisible: false,
          });
        }

        this.lineSeries.setData(this.points);

        this.applyChartOptions();

        if (this.loading) {
          this.chart.timeScale().fitContent();
          this.loading = false;
        }
      }
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
      },
      timeScale: {
        visible: false,
        timeVisible: false,
        secondsVisible: false,
        borderVisible: false
      },
      rightPriceScale: {
        borderVisible: false,
        visible: false
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
      crosshair: {
        vertLine: {
          visible: false
        },
        horzLine: {
          visible: false
        }
      }
    });
  }

  ngOnDestroy() {
    this.chart.remove();
  }
}
