import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { createChart, DeepPartial, IChartApi, ISeriesApi, LineWidth } from 'lightweight-charts';

@Component({
  selector: 'opdex-line-change',
  templateUrl: './line-change.component.html',
  styleUrls: ['./line-change.component.scss']
})
export class LineChangeComponent implements OnChanges, OnInit {
  @ViewChild('chartPreview') container: ElementRef;
  @Input() chartData: any;
  type: string = 'Area';
  lineSeries: ISeriesApi<'Area'>;
  chart: IChartApi;
  redColor = 'rgba(242, 67, 91, 0.8)';
  greenColor = 'rgba(0, 235, 147, 0.8)';
  loading = true;
  id: string;

  constructor() {
    this.id = `${Math.random().toFixed(8)}-chart`;
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.chartData?.length > 0) {
        if (!this.lineSeries) {
          const chart = createChart(this.id, {
            width: 150,
            height: 50
          });

          this.chart = chart;

          this.lineSeries = chart.addAreaSeries({
            lineColor: this.chartData[0].value > this.chartData[this.chartData.length - 1].value ? this.redColor : this.greenColor,
            lineWidth: <DeepPartial<LineWidth>>4,
            topColor: 'transparent',
            bottomColor: 'transparent',
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false
          });
        }

        this.lineSeries.setData(this.chartData);

        this.applyChartOptions();

        this.chart.timeScale().fitContent();

        this.loading = false;
      }
    }, 100);
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
    if (this.chart) this.chart.remove();
  }
}
