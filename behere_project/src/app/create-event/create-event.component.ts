import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Event_t, EventsMiddlemanService } from '../services/events-middleman.service';
import { DataServiceService } from '../data-service.service';
import { MatDialog } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import { CardDComponent } from 'src/app/card-d/card-d.component';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  // Fix this eventually. Works but can lead to memory leaks. Need to figure out a way to create events on initialization.
  alreadyInit : boolean

  // Define the list of events currently stored in the browser

  // Stuff for the create event feature
 

  // This component has full access to the EMS services
  // Which handle all requests from the Event DB
  constructor(public dialog: MatDialog) {}



  ngOnInit() {
    /* load in events */
    /* TODO - update this to interface with backend */


    //window.addEventListener('load', () => {this.initCenter(); console.log('Load event triggered')})
    }
  


  onClickShowD(){
    console.log("asd")

    const dialogRef = this.dialog.open(CardDComponent, {
      width: '70%'
    });
  }
}
