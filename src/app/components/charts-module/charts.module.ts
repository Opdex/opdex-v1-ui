import { SharedPipesModule } from '@sharedPipes/shared-pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineChartComponent } from './line-chart/line-chart.component';
import { LineChangeComponent } from './line-change/line-change.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { CandleChartComponent } from './candle-chart/candle-chart.component';
import { ChartToolbarComponent } from './chart-toolbar/chart-toolbar.component';
import { ChartContainerComponent } from './chart-container/chart-container.component';
import { VolumeChartComponent } from './volume-chart/volume-chart.component';
import { NewLineChartComponent } from './new-line-chart/new-line-chart.component';

@NgModule({
  declarations: [
    LineChartComponent,
    LineChangeComponent,
    CandleChartComponent,
    ChartToolbarComponent,
    ChartContainerComponent,
    VolumeChartComponent,
    NewLineChartComponent
  ],
  imports: [
    CommonModule,
    AngularResizeEventModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    SharedPipesModule
  ],
  exports: [
    LineChartComponent,
    LineChangeComponent,
    CandleChartComponent,
    ChartToolbarComponent,
    ChartContainerComponent,
    VolumeChartComponent
  ]
})
export class ChartsModule { }
