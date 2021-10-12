import { SharedPipesModule } from '@sharedPipes/shared-pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineChartComponent } from './line-chart/line-chart.component';
import { LineChangeComponent } from './line-change/line-change.component';
import { AngularResizedEventModule } from 'angular-resize-event';

@NgModule({
  declarations: [
    LineChartComponent,
    LineChangeComponent
  ],
  imports: [
    CommonModule,
    AngularResizedEventModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    SharedPipesModule
  ],
  exports: [
    LineChartComponent,
    LineChangeComponent
  ]
})
export class ChartsModule { }
