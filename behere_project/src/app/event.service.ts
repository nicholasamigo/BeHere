import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) { }
  createEvent(name:string, lat:number, lng:number){
    this.http.get(`${environment.serverUrl}/create-event`);
  }
}
