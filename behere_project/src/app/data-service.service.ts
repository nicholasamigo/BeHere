import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class DataServiceService {

  dataUpdated:EventEmitter<any> = new EventEmitter();

  constructor() { }

  setLatestData(data) {
    this.dataUpdated.emit(data);
  }

}
