import { Injectable } from '@angular/core';
import {HttpClient, HttpParams } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GoogleMapsModule } from '@angular/google-maps';


@Injectable({
  providedIn: 'root'
})
export class EventsMiddlemanService {

  constructor(private http: HttpClient) { }

  getEventsAroundLocation(lat: number, lng: number, radius: number) {
    const params = new HttpParams()
    .set('lat', lat)
    .set('lng', lng)
    .set('radius', radius);

    const url = `${environment.serverUrl}/getEventsAroundLocation`;
    console.log("request to", url, params);
    return this.http.get<any[]>(url, { params })
    .pipe(
      map(response => response.map(event => new Event_t(event.ID, event.Name, event.HostId, 
        event.Lat, event.Lng))),
      catchError(error => {
        console.error('Error retrieving events:', error);
        return [];
      })
    );
  }

  createEvent(name:string, lat:number, lng:number){
    const params = new HttpParams()
    .set('name', name)
    .set('lat', lat)
    .set('lng', lng)
    // this.http.get(`${environment.serverUrl}/create-event`);
    const url = `${environment.serverUrl}/create-event`;
    console.log("ems request to", url, params);
    return this.http.get<any[]>(url, {params})
    .pipe(
      map(response => response.map(event => new Event_t(event.ID, event.Name, event.HostId, 
        event.Lat, event.Lng))),
      catchError(error => {
        console.error('Error Creating events:', error);
        return [];
      })
    );
  }
}
export class Event_t {
  // TODO - update these structs
  // This needs to match the Event struct definition in main.go
  constructor(public id: number, public name: string, 
    public hostid: number, public lat: number, public lng: number) {}
}

  /**
   * getLatLng
   */
  export function getGoogleLatLngFromEvent(event_t : Event_t) {
    return new google.maps.LatLng(event_t.lat, event_t.lng);
  }