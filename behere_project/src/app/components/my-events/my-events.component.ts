import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Event_t, EventsMiddlemanService } from '../../services/events-middleman.service';
import { DataServiceService } from '../../data-service.service';
import { CardAComponent } from '../card-a/card-a.component';
import { CardBComponent } from '../card-b/card-b.component';
import { MatDialog } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';
import { CardDComponent } from 'src/app/components/card-d/card-d.component';
import { CreateEventComponent } from 'src/app/create-event/create-event.component';
import { NgModule } from '@angular/core'

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']

})

export class MyEventsComponent implements OnInit{

  selectedEvent : Event_t = null
  alreadyInit : boolean


  // Stuff for the create event feature
  d: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  lat:number = 0;
  lng:number = 0;

  constructor(public ems: EventsMiddlemanService) {}

  ngOnInit() {
    }

  @ViewChild('nameInput')
  nameInputReference!: ElementRef;

  refreshEventLists() : void {
    this.ems.pullEMSEvents()
  }
}
