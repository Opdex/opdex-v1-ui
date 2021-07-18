import { FormGroup, FormControl } from '@angular/forms';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { createChart, ISeriesApi, IChartApi, LineWidth, DeepPartial, MouseEventParams } from 'lightweight-charts';

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
  volumeSeries: ISeriesApi<'Histogram'>;
  chart: IChartApi;
  loading = true;
  chartType: any;
  @Input() selectedChart: any;
  @Input() chartOptions: any[];
  @Output() onTypeChange = new EventEmitter<string>();

  ngOnChanges() {
    this.ngOnInit();

    if (this.chartData && this.chartOptions) {
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

      if (!this.volumeSeries) {
        this.volumeSeries = this.chart.addHistogramSeries({
          priceFormat: {
            type: 'volume',
          },
          color: 'rgba(71, 188, 235, .8)',
          lastValueVisible: false,
          priceScaleId: '',
          base: 0,
          scaleMargins: {
            top: 0.2,
            bottom: 0,
          },
        });
      }

      if (this.chartOptions && this.selectedChart.type === 'line') {
        this.lineSeries.setData(this.chartData);
        this.volumeSeries.setData([])
      } else if (this.chartOptions && this.selectedChart.type === 'bar') {
        this.volumeSeries.setData(this.chartData);
        this.lineSeries.setData([]);
      }

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

  switchChartType(value: string) {
    this.onTypeChange.emit(value);
  }

  crosshairMovedHandler(param: MouseEventParams): void {
    if ( param === undefined || param.time === undefined || param.point.x < 0 || param.point.y < 0) {
      this.setLastBarText();
    } else {
      this.value = this.nFormatter(param.seriesPrices.values().next().value, 2);
    }
  }

  onResized(event: ResizedEvent) {
    this.chart.resize(event.newWidth, 400);
    this.chart.timeScale().fitContent();
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
      this.value = this.nFormatter(this.chartData[this.chartData.length - 1].value, 2);
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
        textColor: '#f4f4f4',
        fontSize: 14,
        fontFamily: 'Arial'
      },
      timeScale: {
        visible: true,
        timeVisible: true,
        secondsVisible: true,
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
