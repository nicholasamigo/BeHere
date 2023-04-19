import { Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';
import { Event_t, EventsMiddlemanService } from '../services/events-middleman.service';
import { DataServiceService } from '../data-service.service';
import { MatDialog } from '@angular/material/dialog';
import { HelloWorldService } from '../hello-world.service';
import { AuthService } from '../services/auth/auth.service';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-map-n-feed',
  templateUrl: './map-and-feed.component.html',
  styleUrls: ['./map-and-feed.component.css']
})
export class MapAndFeedComponent implements OnInit{

  name = 'Angular';
  dataArr = [];

  title:string = "";

  @Input() allData: [];
  latData: any;

  // Allow direct reading of the big google map Angular component in "map"
  @ViewChild('primary_google_map', { static: false }) map: GoogleMap

  //@ViewChild('bluemarker', { static: false }) bluemarker: MapMarker;
  bluemarker: google.maps.Marker

  @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;

  selectedEvent : Event_t = null
  alreadyInit : boolean

  highlightedCard : HTMLElement

  // instantiate the GMap
  display: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  center: google.maps.LatLngLiteral;
  zoom = 12;


  // Define the list of events currently stored in the browser
  eventList: Event_t[]=[];

  // Stuff for the create event feature
  cE:string = "Create Event";
  d: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  lat:number = 0;
  lng:number = 0;

  options: google.maps.MapOptions = {
    minZoom: 8
  };

  markerOptions: google.maps.MarkerOptions = {
    optimized: false
  }

  options2: google.maps.MapOptions = {
    minZoom: 8
  };

  markerOptions2: google.maps.MarkerOptions = {
    optimized: false,
    animation: google.maps.Animation.BOUNCE,
    icon:  {url: "../../assets/bluepin.png", scaledSize: new google.maps.Size(30, 45)},
    zIndex: 1000
  }

  // This component has full access to the EMS services
  // Which handle all requests from the Event DB
  constructor(private hw: HelloWorldService, public ems: EventsMiddlemanService, private dataService: DataServiceService) {}



  ngOnInit() {
    /* load in events */
    /* TODO - update this to interface with backend */

    // Read from getTitle which is on backend API. Convert back from JSON into a struct
    this.hw.getTitle()
      .subscribe(data => this.title = JSON.parse(JSON.stringify(data)).title);
    console.log(this.title);

    this.eventList = [];
    this.alreadyInit = false

    this.center = {lat: 24, lng: 12}

    /* set position on user's location */
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    this.bluemarker = new google.maps.Marker(this.markerOptions2)
  }

  updateEventList() {
    let lat = this.center.lat;
    let lng = this.center.lng;

    let bounds : google.maps.LatLngBounds = this.map.getBounds();
    let radius : number = bounds.getNorthEast().lat() - lat + 0.1;

    console.log("Got lat=", lat, " and lng=", lng, "and radius=", radius);
    
    // TODO - reimplement with a call to getEventsWithinBounds
    // Will be simpler and probably faster
    this.ems.getEventsAroundLocation(lat, lng, radius)
    .subscribe(data => this.eventList = JSON.parse(JSON.stringify(data)));
    console.log("Event list updated");
  }

  initEventList() {
    if (!this.alreadyInit) {
      this.alreadyInit = true
      this.updateEventList()
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    //this.markerPositions.pop();
    //this.markerPositions.push(event.latLng.toJSON());
  }

  updateSelectedLocation(event: google.maps.MapMouseEvent){
    this.d = event.latLng.toJSON();
    this.lat = this.d.lat;
    this.lng = this.d.lng;
  }

  openInfoWindow(marker: MapMarker, currevent : Event_t) {
    // this.infoContent = currevent;
    // this.infoWindow.open(marker);
    //this.currevent = currevent;
    
    // does nothing lmao
    
    // TODO NEXT - Use getEventsAroundLocation
    // to refresh the map using dummy data
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null)
    {
      this.display = event.latLng.toJSON();
    }
  }

  /* Plot user position on Gmap */
  currentLat: any;
  currentLong: any;

  /* Handle user GPS tracking */

  trackUser() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        //this.showTrackingPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }


  onAddTimestamp() {
    this.dataArr.push(this.display.lat);
    this.dataService.setLatestData(this.display.lat);
  }

  @ViewChild('nameInput')
  nameInputReference!: ElementRef;

  testLog() {
    console.log("Map-n-feed Received the Event that dialog C closed")
  }

  // wrapper for scrollToCard
  onCardClick(event : Event_t){
    this.selectedEvent = event
    this.scrollToCard()
  }

  scrollToCard() {
    const card = document.getElementById(this.selectedEvent.id.toString());
    //this.bluemarker = new google.maps.Marker(this.markerOptions2)
    this.bluemarker.setAnimation(google.maps.Animation.BOUNCE)
    this.bluemarker.setPosition({lat: this.selectedEvent.lat, lng: this.selectedEvent.lng})
    this.bluemarker.setMap(this.map.googleMap)
    // redraw

    // Remove highlight on previous card
    // if (this.highlightedCard) {
    //   this.highlightedCard.classList.remove('selected');
    // }

    // if (card) {
    //   card.classList.add('selected')
    //   this.highlightedCard = card
    // }
    if (card)
      card.scrollIntoView({ behavior: 'smooth' })
  }

  onMarkerClick(event: Event_t) {
    this.selectedEvent = event
    const card = document.getElementById(event.id.toString());
    if (!card) // card not found, go to Nearby Events tab
    {
      this.tabGroup.selectedIndex = 0
      console.log("Tried to switch tabs")
    }
    else{
      this.scrollToCard()
    }
  }

  // when tabs change at all -> try to scroll to the cardon
  onTabChange() {
    this.scrollToCard()
  }

  recenterMapView() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.zoom = 12;
    });
  }
}
