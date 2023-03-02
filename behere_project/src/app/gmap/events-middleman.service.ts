import { Injectable } from '@angular/core';
import {HttpClient, HttpParams } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsMiddlemanService {

  constructor(private http: HttpClient) { }

  getEventsAroundLocation(lat: number, lng: number, radius: number) {
    const params = new HttpParams()
    .set('lat', lat.toString())
    .set('lng', lng.toString())
    .set('radius', radius.toString());

    const url = `${environment.serverUrl}/getEventsAroundLocation`;
    return this.http.get(url, { params });
  }
}
