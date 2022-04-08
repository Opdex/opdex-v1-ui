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
  selectedChartType: string;
  latestValue: string;
  icons = Icons;

  @Output() onSelectChartType = new EventEmitter<string>();
  @Output() onSelectChart = new EventEmitter<string>();
  @Input() chartsHistory: IChartsSnapshotHistory;
  @Input() set selectedChart(value: IChartData) {
    if (value.label !== this.selectedChart?.label) {
      this.selectedChartType = value.chartTypes[0];
    }

    this._selectedChart = value;
    this._setLatestValue();
  }

  public get selectedChart(): IChartData {
    return this._selectedChart;
  }

  private _setLatestValue() {
    const { values } = this.selectedChart;
    const last = values[values.length - 1] as any;
    const lastValue = last?.close || last?.value;

    this.latestValue = !!lastValue ? lastValue.toFixed(8) : '0'
  }

  selectChart(chart: string): void {
    // Only emit when the chart changes
    if (chart !== this._selectedChart.label) {
      this.onSelectChart.emit(chart);
    }
  }

  selectChartType(type: string): void {
    this.selectedChartType = type;
    this.onSelectChartType.emit(type);
  }
}
