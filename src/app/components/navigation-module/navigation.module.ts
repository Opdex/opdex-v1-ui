import { SharedPipesModule } from '@sharedPipes/shared-pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SideNavComponent } from './side-nav/side-nav.component';
import { HamburgerComponent } from './hamburger/hamburger.component';
import { StatusBarComponent } from './status-bar/status-bar.component';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';

@NgModule({
  declarations: [
    SideNavComponent,
    HamburgerComponent,
    StatusBarComponent,
    MobileNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    SharedPipesModule
  ],
  exports: [
    SideNavComponent,
    HamburgerComponent,
    StatusBarComponent,
    MobileNavComponent
  ]
})
export class NavigationModule { }
