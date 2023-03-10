import { Component, OnInit, ViewChild } from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';
import { EventsMiddlemanService, Event_t } from './events-middleman.service';

/* 
// From now on, use the offical Event_t class from events-middleman.service


class DummyEvent { 
id: number;
title: string;
loc: google.maps.LatLngLiteral;
locationName: string;
time: number;

  constructor(id: number, title: string, loc: google.maps.LatLngLiteral, locationName: string, time: number) {
    this.id = id;
    this.title = title;
    this.loc = loc;
    this.locationName = locationName;
    this.time = time;
  }
} */

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit{

  // Allow direct reading of the google map Angular component in "map"
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap

  // Allow reading of the child object, InfoWindow
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  infoContent = '';

  // Fix this eventually. Works but can lead to memory leaks. Need to figure out a way to create events on initialization.
  currevent = new Event_t(0, "", 0, 0, 0);


  // instantiate the GMap
  display: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 12;
  // markerPositions: google.maps.LatLngLiteral[] = [];

  // Define the list of events currently stored in the browser
  eventList: Event_t[]=[];

  options: google.maps.MapOptions = {
    minZoom: 8
  };

  // This component has full access to the EMS services
  // Which handle all requests from the Event DB
  constructor(private ems: EventsMiddlemanService) {}

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
}
