import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Event_t, EventsMiddlemanService } from '../services/events-middleman.service';
import { DataServiceService } from '../data-service.service';
import { MatDialog } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import { CardDComponent } from 'src/app/components/card-d/card-d.component';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  alreadyInit : boolean

  // This component has full access to the EMS services
  // Which handle all requests from the Event DB
  constructor(public dialog: MatDialog, private ems : EventsMiddlemanService) {}

  ngOnInit() {
    }
  
  onClickShowD(){
    console.log("asd")

    const dialogRef = this.dialog.open(CardDComponent, {
      width: '80%'
    });
  }
}
