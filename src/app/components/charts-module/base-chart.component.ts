import { Subscription } from 'rxjs';
import { Injector } from "@angular/core";
import { ChartOptions, createChart, DeepPartial, IChartApi } from "lightweight-charts";
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ShortNumberPipe } from '@sharedPipes/short-number.pipe';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { ResizedEvent } from 'angular-resize-event';
import { Icons } from 'src/app/enums/icons';

export abstract class BaseChartComponent {
  chart: IChartApi;
  width: number;
  height: number;
  theme: string;
  loading: boolean = true;
  icons = Icons;
  baseSubscription = new Subscription;

  protected _themeService: ThemeService;
  protected _breakpointObserver: BreakpointObserver;

  constructor(protected _shortNumber: ShortNumberPipe, protected _injector: Injector) {
    this._themeService = this._injector.get(ThemeService);
    this._breakpointObserver = this._injector.get(BreakpointObserver);

    this.baseSubscription.add(
      this._themeService.getTheme()
        .subscribe(theme => {
          this.theme = theme;
          if (this.chart) this._applyChartOptions();
        }));

    this.baseSubscription.add(
      this._breakpointObserver
        .observe(['(min-width: 992px)', '(min-width: 1440px)', '(max-width: 667px)'])
        .subscribe((result: BreakpointState) => {
          if (result.breakpoints['(min-width: 1440px)']) this.height = 450;
          else if (result.breakpoints['(min-width: 992px)']) this.height = 400;
          else this.height = 300;

          if (this.chart) this.chart.resize(this.width, this.height);
        }));
  }

  handleResize(event: ResizedEvent): void {
    if (!!this.chart) {
      this.width = event.newRect.width;
      this.chart.resize(event.newRect.width, this.height);
      this.chart.timeScale().fitContent();
    }
  }

  protected _init(divId: string): void {
    this.chart = createChart(divId, this.options);
    this._applyChartOptions();
  }

  protected _applyChartOptions() {
    this.chart.applyOptions(this.options);
  }

  protected _priceFormatter(price: number, prefix: string = '', suffix: string = ''): string {
    if (price < 0) return '';

    let fixed = price.toString().includes('.')
      ? price.toString().split('.')[1].length
      : 0;

    fixed = fixed > 8 ? 8 : fixed;

    const shortNumber = this._shortNumber.transform(price);

    if (shortNumber == 'NAN') return '';

    return shortNumber.includes('<')
      ? `${prefix}${price.toFixed(fixed)} ${suffix}`
      : `${prefix}${shortNumber} ${suffix}`;
  }

  public get options(): DeepPartial<ChartOptions> {
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
        autoScale: true
      },
      handleScroll: true,
      handleScale: true
    }
  }
}
