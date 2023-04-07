import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventsMiddlemanService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getEventsAroundLocation(lat: number, lng: number, radius: number) {
    const params = new HttpParams()
    .set('lat', lat)
    .set('lng', lng)
    .set('radius', radius);

    const url = `${environment.serverUrl}/getEventsAroundLocation`;
    console.log("request to", url, params);
    return this.http.get<any[]>(url, { params })
    .pipe(
      map(response => response.map(event => new Event_t(event.ID, event.Name,  event.Bio, event.HostId,
        event.Lat, event.Lng, event.Address, event.Date, event.Time))),
      catchError(error => {
        console.error('Error retrieving events:', error);
        return [];
      })
    );
  }

  /* Example of an HTTP POST */
  createEvent(event : Event_t) {
    const url = `${environment.serverUrl}/create-event`;
    console.log("ems post to", url);
    this.http.post(url, event).subscribe({
      next: data => console.log("Sucess creating Event"),
      error: error => console.log("Error!", error)
    });
  }

  createAttend(event : Event_t) {
    // Assumes that there is a valid current user
    let ar = new Attend_t(event.id, this.auth.user.uid)

    const url = `${environment.serverUrl}/createAttend`;
    console.log("ems post attend to", url);
    this.http.post(url, ar).subscribe({
      next: data => console.log("Sucess creating attend"),
      error: error => console.log("Error!", error)
    })
  }

  deleteAttend(event : Event_t){
    // Assumes that there is a valid current user
    let ar = new Attend_t(event.id, this.auth.user.uid)

    const url = `${environment.serverUrl}/deleteAttend`;
    console.log("ems post attend to", url);
    this.http.post(url, ar).subscribe({
      next: data => console.log("Sucess deleting attend"),
      error: error => console.log("Error!", error)
    })
  }

  countAttend(event : Event_t) : number {
    const params = new HttpParams()
    .set('eid', event.id)

    let my_count = 0

    const url = `${environment.serverUrl}/countAttend`;
    console.log("Count request to", url, params)
    this.http.get<number>(url, {params}).subscribe({
      // Observable parameter
      next: data => my_count && console.log('Counted successfully'),
      error: error => console.error('Error counting event', error)
    });
    return my_count
  }
}
export class Event_t {
  // TODO - update these structs
  // This needs to match the Event struct definition in main.go
  constructor(public id: number, public name: string, public bio: string,
    public hostid: number, public lat: number, public lng: number, 
    public address: string, public date: string, public time: string) {}
}

/**
 * getLatLng
 */
export function getGoogleLatLngFromEvent(event_t : Event_t) {
  return new google.maps.LatLng(event_t.lat, event_t.lng);
}

export class Attend_t {
  constructor(public EID : number, public PID : string) {}
}