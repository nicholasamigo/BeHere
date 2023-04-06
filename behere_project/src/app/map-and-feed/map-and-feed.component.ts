import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';
import { Event_t, EventsMiddlemanService } from '../services/events-middleman.service';
import { DataServiceService } from '../data-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth/auth.service';
@Component({
  selector: 'app-map-n-feed',
  templateUrl: './map-and-feed.component.html',
  styleUrls: ['./map-and-feed.component.css']
})
export class MapAndFeedComponent implements OnInit{

  name = 'Angular';
  dataArr = [];

  // Allow direct reading of the big google map Angular component in "map"
  @ViewChild('primary_google_map', { static: false }) map: GoogleMap

  // Allow reading of the child object, InfoWindow
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  infoContent = '';

  // Fix this eventually. Works but can lead to memory leaks. Need to figure out a way to create events on initialization.
  currevent = new Event_t(0, "", "", 0, 0, 0, "", "", "");

  selectedEvent : Event_t = null


  // instantiate the GMap
  display: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 12;
  // markerPositions: google.maps.LatLngLiteral[] = [];

  // Define the list of events currently stored in the browser
  eventList: Event_t[]=[];
  throwaway: Event_t[]=[];

  // Stuff for the create event feature
  cE:string = "Create Event";
  d: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  lat:number = 0;
  lng:number = 0;

  // Event to be displayed for more info (Card Type B)
  e = new Event_t(0,"","",0,0,0,"","","");

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
    optimized: false
  }

  // This component has full access to the EMS services
  // Which handle all requests from the Event DB
  constructor(private ems: EventsMiddlemanService, private dataService: DataServiceService) {}



  ngOnInit() {
    /* load in events */
    /* TODO - update this to interface with backend */

    this.eventList = [];

    // Test dummy events
    //let dummy1 = new DummyEvent(1, "Party at AJs!", { lat: 29.644954782334302, lng: -82.35255807676796}, "AJ's House", 7);
    //let dummy2 = new DummyEvent(2, "Dinner at Johns", { lat: 29.669247750220627, lng: -82.33697355656128}, "John's Apartment", 5);
    //let dummy3 = new DummyEvent(3, "Pool Night at Nicks", {lat: 29.685355319870283, lng: -82.38572538761596}, "Nick's Condo", 8);

    // let dummy1 = new Event_t(1, "Party at AJs!", 1, 29.644954782334302, -82.35255807676796);
    // let dummy2 = new Event_t(2, "Dinner at Johns", 1, 29.669247750220627, -82.33697355656128);
    // let dummy3 = new Event_t(3, "Pool Night at Nicks", 1, 29.685355319870283, -82.38572538761596);
  

    // this.eventList.push(dummy1);
    // this.eventList.push(dummy2);
    // this.eventList.push(dummy3);

    /* set position on user's location */
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  // Called when card A info is clicked.
  // This sets "selectedEvent" so that the cardB will pop up (it is *ngif'ed in)
  openCardB(eventdata : Event_t) {
    this.selectedEvent = eventdata
  }

    // // Function to show Card B version of Event
    // showCardB(eID: number){
    //   for(let i = 0; i < this.eventList.length; i++){
    //     if(this.eventList[i].id == eID){
    //       this.e = this.eventList[i];
    //       var x = document.getElementById("cardB") as HTMLSelectElement;
    //       if (x.style.display === "none") {
    //         x.style.display = "flex";
    //       } else {
    //         x.style.display = "none";
    //       }
    //       document.getElementById("overlay").style.display = "block";
    //     }
    //   }
    // }

      // Function to close Card B version of Event
      // closeCardB(){
      //   var x = document.getElementById("cardB") as HTMLSelectElement;
      //   if (x.style.display === "none") {
      //     x.style.display = "flex";
      //     document.getElementById("overlay").style.display = "none";
      //   } else {
      //     x.style.display = "none";
      //     document.getElementById("overlay").style.display = "none";
      //   }
      // }
  
  closeCardB() {
    this.selectedEvent = null
  }

  updateEventList() {
    let latlng : google.maps.LatLng = this.map.getCenter();
    let lat : number = latlng.lat();
    let lng : number = latlng.lng();

    let bounds : google.maps.LatLngBounds = this.map.getBounds();
    let radius : number = bounds.getNorthEast().lat() - lat;

    console.log("Got lat=", lat, " and lng=", lng, "and radius=", radius);
    
    // TODO - reimplement with a call to getEventsWithinBounds
    // Will be simpler and probably faster
    this.ems.getEventsAroundLocation(lat, lng, radius)
    .subscribe(data => this.eventList = JSON.parse(JSON.stringify(data)));
    console.log("Event list updated");
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
    this.currevent = currevent;
    
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

//  showTrackingPosition(position) {
//     console.log(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
//     this.currentLat = position.coords.latitude;
//     this.currentLong = position.coords.longitude;

//     let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//     this.panTo(location);

//     if (!this.marker) {
//       this.marker = new google.maps.Marker({
//         position: location,
//         map: this.map,
//         title: 'Got you!'
//       });
//     }
//     else {
//       this.marker.setPosition(location);
//     }
//   }

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

  // TODO - Rewrite the form, nameInputReference is DISGUSTING syntax
  // John you absolute buffoon
  createEvent(){
    let e = new Event_t(0, this.nameInputReference.nativeElement.value, "Bio",
      0,
      this.lat, 
      this.lng,
      "Balls avenue",
      "04/23/2022",
      "4PM")
    this.ems.createEvent(e)
    .subscribe({
      // Observable parameter
      next: data => console.log('Event created successfully'),
      error: error => console.error('Error updating event', error)
    });
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
