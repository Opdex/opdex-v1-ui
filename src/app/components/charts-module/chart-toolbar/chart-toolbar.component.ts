import { Icons } from 'src/app/enums/icons';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IChartData, IChartsSnapshotHistory } from '@sharedModels/ui/markets/market-history';

@Component({
  selector: 'opdex-chart-toolbar',
  templateUrl: './chart-toolbar.component.html',
  styleUrls: ['./chart-toolbar.component.scss']
})
export class ChartToolbarComponent {
  @Input() chartsHistory: IChartsSnapshotHistory;
  @Input() selectedChart: IChartData;
  @Output() onSelectChartType = new EventEmitter<string>();
  @Output() onSelectChart = new EventEmitter<string>();
  icons = Icons;

  public get latestValue(): string {
    const { values } = this.selectedChart;
    const last = values[values.length - 1] as any;
    const lastValue = last?.close || last?.value;
    return !!lastValue ? lastValue.toString() : ''
  }

  selectChart(chart: string): void {
    this.onSelectChart.emit(chart);
  }

  selectChartType(type: string) {
    this.onSelectChartType.emit(type);
  }
}
