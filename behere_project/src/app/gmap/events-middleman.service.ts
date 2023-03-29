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
        event.Lat, event.Lng, event.Address, event.Date, event.Time))),
      catchError(error => {
        console.error('Error retrieving events:', error);
        return [];
      })
    );
  }
}
export class Event_t {
  // TODO - update these structs
  // This needs to match the Event struct definition in main.go
  constructor(public id: number, public name: string, 
    public hostid: number, public lat: number, public lng: number, 
    public address: string, public date: string, public time: string) {}
}

  /**
   * getLatLng
   */
  export function getGoogleLatLngFromEvent(event_t : Event_t) {
    return new google.maps.LatLng(event_t.lat, event_t.lng);
  }