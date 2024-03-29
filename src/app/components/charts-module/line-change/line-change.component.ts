import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { createChart, DeepPartial, IChartApi, ISeriesApi, LineData, LineWidth } from 'lightweight-charts';

@Component({
  selector: 'opdex-line-change',
  templateUrl: './line-change.component.html',
  styleUrls: ['./line-change.component.scss']
})
export class LineChangeComponent implements OnChanges, OnInit {
  @ViewChild('chartPreview') container: ElementRef;
  @Input() chartData: LineData[];
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

          this.lineSeries = chart.addAreaSeries({
            lineColor: this.chartData[0].value > this.chartData[this.chartData.length - 1].value ? this.redColor : this.greenColor,
            lineWidth: <DeepPartial<LineWidth>>4,
            topColor: this.chartData[0].value > this.chartData[this.chartData.length - 1].value ? 'rgba(242, 67, 91, .4)' : 'rgba(0, 235, 147, .4)',
            bottomColor: this.chartData[0].value > this.chartData[this.chartData.length - 1].value ? 'rgba(242, 67, 91, .01)' : 'rgba(0, 235, 147, .01)',
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false
          });

          this.chart = chart;
        }

        this.lineSeries.setData(this.chartData);

        this.applyChartOptions();

        this.chart.timeScale().fitContent();

        this.loading = false;
      }
    }, 0);
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
      handleScroll: false,
      handleScale: false,
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
