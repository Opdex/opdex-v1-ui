import { Icons } from 'src/app/enums/icons';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IChartData, IChartsSnapshotHistory } from '@sharedModels/ui/markets/market-history';

@Component({
  selector: 'opdex-chart-toolbar',
  templateUrl: './chart-toolbar.component.html',
  styleUrls: ['./chart-toolbar.component.scss']
})
export class ChartToolbarComponent {
  private _selectedChart: IChartData;

  public get selectedChart(): IChartData {
    return this._selectedChart;
  }

  @Input() set selectedChart(value: IChartData) {
    if (value.label !== this.selectedChart?.label) {
      this.selectedChartType = value.chartTypes[0];
    }

    this._selectedChart = value;
  }

  @Input() chartsHistory: IChartsSnapshotHistory;
  @Output() onSelectChartType = new EventEmitter<string>();
  @Output() onSelectChart = new EventEmitter<string>();
  icons = Icons;
  selectedChartType: string;

  public get latestValue(): string {
    const { values } = this.selectedChart;
    const last = values[values.length - 1] as any;
    const lastValue = last?.close || last?.value;
    return !!lastValue ? lastValue.toString() : ''
  }

  selectChart(chart: string): void {
    this.onSelectChart.emit(chart);
  }

  selectChartType(type: string): void {
    this.selectedChartType = type;
    this.onSelectChartType.emit(type);
  }
}
