import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) { }
  createEvent(name:string, lat:number, lng:number){
    const params = new HttpParams()
    .set('name', name)
    .set('lat', lat)
    .set('lng', lng)
    this.http.get(`${environment.serverUrl}/create-event`);
    const url = `${environment.serverUrl}/getEventsAroundLocation`;
    console.log("request to", url, params);
  }
}
export class Event_t {
  // TODO - update these structs
  // This needs to match the Event struct definition in main.go
  constructor(public id: number, public name: string, 
    public hostid: number, public lat: number, public lng: number) {}
}
