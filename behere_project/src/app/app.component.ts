import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { HelloWorldService } from './hello-world.service';
import { DataServiceService } from './data-service.service';
import { EventsMiddlemanService } from './services/events-middleman.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  lat:number = 0;
  lng:number = 0;


  constructor(private ems: EventsMiddlemanService, private dataService: DataServiceService) {}

  ngOnInit() {
    
  }
}