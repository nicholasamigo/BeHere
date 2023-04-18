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
  title : string

  constructor(private hw : HelloWorldService) {}
  
  ngOnInit() {
    this.hw.getTitle().subscribe({
      next: data => this.title = JSON.parse(JSON.stringify(data)).title
    })
  }
}