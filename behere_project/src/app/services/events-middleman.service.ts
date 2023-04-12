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

  public currentlyAttendingEventIDs : number[] = []
  geocoder : google.maps.Geocoder

  constructor(private http: HttpClient, private auth: AuthService) {
    // subscribe to service
      auth.loginStatusChanged$.subscribe(() => {
      console.log('Login status changed')
      this.refreshCurrentAttend()

    });

    this.geocoder = new google.maps.Geocoder();
   }

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
  async createEvent(event : Event_t) {
    if (this.auth.user) {
      event.hostid = this.auth.user.uid
      let address = await this.getAddress(event)
      event.address = address
      const url = `${environment.serverUrl}/create-event`;
      console.log("ems post to", url);
      this.http.post(url, event).subscribe({
        next: data => console.log("Sucess creating Event"),
        error: error => console.log("Error!", error)
      });
    }
  }

  createAttend(event : Event_t) {
    // Assumes that there is a valid current user
    let ar = new Attend_t(event.id, this.auth.user.uid)

    const url = `${environment.serverUrl}/createAttend`;
    console.log("ems post attend to", url);
    this.http.post(url, ar).subscribe({
      next: data => {console.log("Sucess creating attend");
      this.refreshCurrentAttend();
      //this.countAttend(event);
    },
      error: error => console.log("Error!", error)
    })
  }

  deleteAttend(event : Event_t){
    // Assumes that there is a valid current user
    let ar = new Attend_t(event.id, this.auth.user.uid)

    const url = `${environment.serverUrl}/deleteAttend`;
    console.log("ems post attend to", url);
    this.http.post(url, ar).subscribe({
      next: data => {console.log("Sucess deleting attend");
      this.refreshCurrentAttend();
      //this.countAttend(event);
    },
      error: error => console.log("Error!", error)
    })
  }

  countAttend(event : Event_t) : Observable<number> {
    const params = new HttpParams()
    .set('eid', event.id)

    const url = `${environment.serverUrl}/countAttend`;
    console.log("Count request to", url, params)

    return this.http.get<number>(url, {params})
  }

  // Updates the list of EIDs of current user
  // This should be called upon login as well.
  refreshCurrentAttend() : void {
    if (!this.auth.user) {
      this.currentlyAttendingEventIDs = []
      console.log("Cleared currently attending events")
    }
    else {
      const params = new HttpParams()
      .set('uid', this.auth.user.uid);
  
      console.log("New User id is ", this.auth.user.uid)
      const url = `${environment.serverUrl}/getAttendingEventIDs`;
      console.log("request to", url, params);
      this.http.get<any[]>(url, { params }).subscribe({
        next: (eids) => {
          this.currentlyAttendingEventIDs = eids;
          console.log("EventIDS ", this.currentlyAttendingEventIDs);
        },
        error: (error) => console.log("Error getting EIDS", error),
      })
    }
  }

  // called to cancel the event
  deleteEvent(event : Event_t) : void {
    if (this.auth.user)
    {
        const url = `${environment.serverUrl}/deleteEvent`;
        console.log("ems post delete event to", url);
        this.http.post(url, event).subscribe({
          next: data => {console.log("Sucess deleting event");
        },
          error: error => console.log("Error!", error)
        })
    }
    else 
    {
      console.log("Can't delete, no one logged in")
    }
  }

  // called to complete the event
  completeEvent(event : Event_t) : void {
    if (this.auth.user)
    {
        const url = `${environment.serverUrl}/completeEvent`;
        console.log("ems post complete event to", url);
        this.http.post(url, event).subscribe({
          next: data => {console.log("Sucess completing event");
        },
          error: error => console.log("Error!", error)
        })
    }
    else 
    {
      console.log("Can't complete, no one logged in")
    }
  }

  //called to get all deleted previous
  //caller must subscribe to this event.
  getDeletedAttendedEvents() {
    if (!this.auth.user) {console.log("No one logged in"); return []}
      
    const params = new HttpParams()
    .set('uid', this.auth.user.uid);

    const url = `${environment.serverUrl}/getDeletedAttendedEvents`;
    console.log("request to", url, params);
    return this.http.get<any[]>(url, { params }).pipe(
      map(response => response.map(event => new Event_t(event.ID, event.Name,  event.Bio, event.HostId,
        event.Lat, event.Lng, event.Address, event.Date, event.Time))),
      catchError(error => {
        console.error('Error retrieving events:', error);
        return [];
      })
    );
  }

 async editEvent(event : Event_t)  {
    if (this.auth.user) {
      const url = `${environment.serverUrl}/edit-event`;
      console.log("ems post to", url);

      // Maintain correct ID
      event.hostid = this.auth.user.uid
      let address = await this.getAddress(event)
      event.address = address
      
      this.http.post(url, event).subscribe({
        // Observable parameter
        next: data => console.log('Event edited successfully'),
        error: error => console.error('Error updating event', error)
      });
    }
}

 async getAddress(event : Event_t) : Promise<string> {
  var address : string = "not updated"
  await this.geocoder.geocode({location: {lat : event.lat, lng : event.lng}}, 
    function(results, status) {
      if (status == 'OK') { // properly encoded
        address =  results[0].formatted_address
        console.log("Received address: ", address)
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    }
    )
    return address
 }

}

export class Event_t {
  // TODO - update these structs
  // This needs to match the Event struct definition in main.go
  constructor(public id: number, public name: string, public bio: string,
    public hostid: string, public lat: number, public lng: number, 
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