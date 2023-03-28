import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { Data } from '@angular/router';
import {HelloWorldService} from './hello-world.service';
import {EventService} from './event.service';
import { DataServiceService } from './data-service.service';
import { GmapComponent } from './gmap/gmap.component';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title:string = "";
  cE:string = "Create Event";
  lat:number = 0;
  lng:number = 0;

  @Input() allData: [];
  latData: any;

  constructor(private hw: HelloWorldService, private es: EventService, private dataService: DataServiceService) {}

  ngOnInit() {
    
    // Read from getTitle which is on backend API. Convert back from JSON into a struct
    this.hw.getTitle()
      .subscribe(data => this.title = JSON.parse(JSON.stringify(data)).title);
    console.log(this.title);

    this.dataService.dataUpdated.subscribe((data) => {
      this.latData = data;
    });
  }

  @ViewChild('nameInput')
  nameInputReference!: ElementRef;

  @ViewChild('latInput')
  latInputReference!: ElementRef;

  @ViewChild('lngInput')
  lngInputReference!: ElementRef;

  createEvent(){
    return this.es.createEvent(
      this.nameInputReference.nativeElement.value,
      this.latInputReference.nativeElement.value,
      this.lngInputReference.nativeElement.value
    );
  }

  openCreateEvent(){
    var x = document.getElementById("cE") as HTMLSelectElement;
    if (x.style.display === "none") {
      x.style.display = "block";
      this.cE = "Close";
    } else {
      x.style.display = "none";
      this.cE = "Create Event";
    }
  }

  updateData(){
    this.dataService.dataUpdated.subscribe((data) => {
      this.latData = data;
    });
  }
}