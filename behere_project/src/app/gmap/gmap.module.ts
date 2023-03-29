import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GmapComponent } from './gmap.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    GmapComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    AppRoutingModule
  ],
  exports: [
    GmapComponent
  ]
})
export class GmapModule { }
