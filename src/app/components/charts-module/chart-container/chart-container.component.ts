import { OnChanges } from '@angular/core';
import { Component, Input } from '@angular/core';
import { IChartData, IChartsSnapshotHistory } from '@sharedModels/ui/markets/market-history';

@Component({
  selector: 'opdex-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss']
})
export class ChartContainerComponent implements OnChanges {
  @Input() chartsHistory: IChartsSnapshotHistory;
  selectedChart: IChartData;
  selectedChartType: string;

  ngOnChanges(): void {
    if (!this.selectedChart && this.chartsHistory) {
      this.selectedChart = this.chartsHistory.charts[0];
      this.selectedChartType = this.chartsHistory.charts[0].chartTypes[0];
    } else if (this.selectedChart && this.chartsHistory) {
      const chartIndex = this.chartsHistory.charts.findIndex(chart => chart.label === this.selectedChart.label);
      if (chartIndex >= 0) {
        this.selectedChart = this.chartsHistory.charts[chartIndex];
      }
    }
  }

  handleSelectChartType(type: string): void {
    this.selectedChartType = type;
  }

  handleSelectChart(type: string): void {
    this.selectedChart = this.chartsHistory.charts.find(chart => chart.label === type);
    this.selectedChartType = this.selectedChart.chartTypes[0];
  }
}
