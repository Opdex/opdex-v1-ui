import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineChartComponent } from './line-chart/line-chart.component';
import { LineChangeComponent } from './line-change/line-change.component';

@NgModule({
  declarations: [
    LineChartComponent,
    LineChangeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LineChartComponent,
    LineChangeComponent
  ]
})
export class ChartsModule { }
