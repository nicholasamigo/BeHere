import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { Data } from '@angular/router';
import {HelloWorldService} from './hello-world.service';
import { DataServiceService } from './data-service.service';
import { GmapComponent } from './gmap/gmap.component';
import { EventsMiddlemanService } from './gmap/events-middleman.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title:string = "";
  lat:number = 0;
  lng:number = 0;

  @Input() allData: [];
  latData: any;

  constructor(private hw: HelloWorldService, private ems: EventsMiddlemanService, private dataService: DataServiceService) {}

  ngOnInit() {
    
    // Read from getTitle which is on backend API. Convert back from JSON into a struct
    this.hw.getTitle()
      .subscribe(data => this.title = JSON.parse(JSON.stringify(data)).title);
    console.log(this.title);

    this.dataService.dataUpdated.subscribe((data) => {
      this.latData = data;
    });
  }

  updateData(){
    this.dataService.dataUpdated.subscribe((data) => {
      this.latData = data;
    });
  }
}