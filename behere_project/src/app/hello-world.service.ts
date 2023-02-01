//
// https://stackoverflow.com/questions/37208801/property-map-does-not-exist-on-type-observableresponse

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';


@Injectable()
export class HelloWorldService {

  constructor(private http: HttpClient) { }

  getTitle() {
    return this.http.get(`${environment.serverUrl}/hello-world`);
  }

}