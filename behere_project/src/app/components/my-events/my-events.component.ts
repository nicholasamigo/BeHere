import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Event_t, EventsMiddlemanService } from '../../services/events-middleman.service';
import { DataServiceService } from '../../data-service.service';
import { CardAComponent } from '../card-a/card-a.component';
import { CardBComponent } from '../card-b/card-b.component';
import { MatDialog } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';
import { CardDComponent } from 'src/app/card-d/card-d.component';
import { CreateEventComponent } from 'src/app/create-event/create-event.component';




@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit{

  // Fix this eventually. Works but can lead to memory leaks. Need to figure out a way to create events on initialization.
  currevent = new Event_t(0, "", "", "", 0, 0, "", "", "");

  selectedEvent : Event_t = null
  alreadyInit : boolean

  // Define the list of events currently stored in the browser
  eventList: Event_t[]=[];

  // Stuff for the create event feature
  cE:string = "Create Event";
  d: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  lat:number = 0;
  lng:number = 0;

  // Event to be displayed for more info (Card Type B)
  e = new Event_t(0,"","","",0,0,"","","");
  event: any;


  // This component has full access to the EMS services
  // Which handle all requests from the Event DB
  constructor(public ems: EventsMiddlemanService, private dataService: DataServiceService) {}



  ngOnInit() {
    /* load in events */
    /* TODO - update this to interface with backend */

    this.eventList = [];


    //window.addEventListener('load', () => {this.initCenter(); console.log('Load event triggered')})
    }
  
  // Called when card A info is clicked.
  // This sets "selectedEvent" so that the cardB will pop up (it is *ngif'ed in)


  @ViewChild('nameInput')
  nameInputReference!: ElementRef;

  // TODO - Rewrite the form, nameInputReference is DISGUSTING syntax
  // John you absolute buffoon
  createEvent(){
    let e = new Event_t(0, this.nameInputReference.nativeElement.value, "Bio",
      "Placeholder",
      this.lat, 
      this.lng,
      "Balls avenue",
      "04/23/2022",
      "4PM")
    this.ems.createEvent(e)
  }

  openCreateEvent(){
    var x = document.getElementById("cE") as HTMLSelectElement;
    if (x.style.display === "none") {
      x.style.display = "block";
      this.cE = "Close";
    } else {
      x.style.display = "none";
      this.cE = "Create Event";
    }
  }

}
