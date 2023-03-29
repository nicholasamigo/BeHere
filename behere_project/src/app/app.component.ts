import {Component, OnInit} from '@angular/core';
import {HelloWorldService} from './hello-world.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title:string = "";

  constructor(private hw: HelloWorldService) {}

  ngOnInit() {
    
    // Read from getTitle which is on backend API. Convert back from JSON into a struct
    this.hw.getTitle()
      .subscribe(data => this.title = JSON.parse(JSON.stringify(data)).title);
    console.log(this.title);
  }

}