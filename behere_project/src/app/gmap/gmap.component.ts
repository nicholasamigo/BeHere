import { Component, OnInit, ViewChild } from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';


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
}

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit{

  // Allow reading of the child object, InfoWindow
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  infoContent = '';

  // Fix this eventually. Works but can lead to memory leaks. Need to figure out a way to create events on initialization.
  currevent = new DummyEvent(0, "", {lat: 0, lng: 0}, "", 0);


  // instantiate the GMap
  display: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 12;
  // markerPositions: google.maps.LatLngLiteral[] = [];
  eventList: DummyEvent[]=[];

  options: google.maps.MapOptions = {
    minZoom: 8
  };

  ngOnInit() {
    /* load in events */
    /* TODO - update this to interface with backend */

    this.eventList = [];

    // Test dummy events
    let dummy1 = new DummyEvent(1, "Party at AJs!", { lat: 29.644954782334302, lng: -82.35255807676796}, "AJ's House", 7);

    let dummy2 = new DummyEvent(2, "Dinner at Johns", { lat: 29.669247750220627, lng: -82.33697355656128}, "John's Apartment", 5);

    let dummy3 = new DummyEvent(3, "Pool Night at Nicks", {lat: 29.685355319870283, lng: -82.38572538761596}, "Nick's Condo", 8);

    this.eventList.push(dummy1);
    this.eventList.push(dummy2);
    this.eventList.push(dummy3);

    /* set position on user's location */
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  addMarker(event: google.maps.MapMouseEvent) {
    //this.markerPositions.pop();
    //this.markerPositions.push(event.latLng.toJSON());
  }

  openInfoWindow(marker: MapMarker, currevent : DummyEvent) {
    // this.infoContent = currevent;
    // this.infoWindow.open(marker);
    this.currevent = currevent;
    
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
