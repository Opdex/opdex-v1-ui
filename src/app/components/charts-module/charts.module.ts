import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  declarations: [
    LineChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LineChartComponent
  ]
})
export class ChartsModule { }
