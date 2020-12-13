import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { createChart, ISeriesApi, IChartApi } from 'lightweight-charts';

@Component({
  selector: 'opdex-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  @ViewChild('chartContainer') container : ElementRef;
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
        const data: any = [];

        this.chartData.forEach((point: any) => {
          data.push({
            time: point.time,
            value: point.close,
            color: '#000'
          });
        });

        if (!this.lineSeries) {
          this.lineSeries = this.chart.addAreaSeries({
            lineColor: 'rgba(71, 188, 235, .7)',
            topColor: 'rgba(71, 188, 235, .3)',
            bottomColor: 'rgba(71, 188, 235, .1)',
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
        width: 850,
        height: 300,
        localization: {
          priceFormatter: (price:number) => price.toFixed(2)
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
        backgroundColor: this.theme === 'dark-mode' ? '#100f1d' : 'transparent',
        textColor: '#696969',
        fontSize: 12,
        fontFamily: 'Calibri',
      },
      timeScale: {
        visible: true,
        timeVisible: true,
        secondsVisible: false
      }
    });
  }

  onResize() {
    if (this.container) {
      const size = (this.container.nativeElement as HTMLElement).offsetWidth;

      this.chart.resize(size, 350);
    }
  }

  ngOnDestroy() {
    this.chart.remove();
  }
}