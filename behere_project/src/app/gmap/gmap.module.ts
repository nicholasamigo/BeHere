import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GmapComponent } from './gmap.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppRoutingModule } from '../app-routing.module';
import { AppMaterialModule } from '../app-material.module';

@NgModule({
  declarations: [
    GmapComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  exports: [
    GmapComponent
  ]
})
export class GmapModule { }
