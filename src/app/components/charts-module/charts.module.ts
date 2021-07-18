import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineChartComponent } from './line-chart/line-chart.component';
import { LineChangeComponent } from './line-change/line-change.component';
import { VolumeChartComponent } from './volume-chart/volume-chart.component';
import { AngularResizedEventModule } from 'angular-resize-event';

@NgModule({
  declarations: [
    LineChartComponent,
    LineChangeComponent,
    VolumeChartComponent
  ],
  imports: [
    CommonModule,
    AngularResizedEventModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    LineChartComponent,
    LineChangeComponent,
    VolumeChartComponent
  ]
})
export class ChartsModule { }
