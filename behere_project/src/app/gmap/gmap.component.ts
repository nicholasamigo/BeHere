import { Component, OnInit, ViewChild } from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';


class DummyEvent {
id: number;
date: number;
loc: google.maps.LatLngLiteral;
name: string;

  constructor(id: number, date: number, loc: google.maps.LatLngLiteral, name: string) {
    this.id = id;
    this.date = date;
    this.loc = loc;
    this.name = name;
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

    let dummy = new DummyEvent(1, 24, { lat: 29.644954782334302, lng: -82.35255807676796}, "candyland");
    this.eventList.push(dummy);
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

  openInfoWindow(marker: MapMarker, content) {
    this.infoContent = content;
    this.infoWindow.open(marker);
    
    // TODO - Put event details
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
