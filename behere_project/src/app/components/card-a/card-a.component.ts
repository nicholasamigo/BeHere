import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event_t } from 'src/app/services/events-middleman.service';
import { MatDialog } from '@angular/material/dialog';
import { CardBComponent } from '../card-b/card-b.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventsMiddlemanService } from 'src/app/services/events-middleman.service';

@Component({
  selector: 'app-card-a',
  templateUrl: './card-a.component.html',
  styleUrls: ['./card-a.component.css']
})
export class CardAComponent implements OnInit{


  event : Event_t
  count : number

  @Input() input_event : Event_t

  @Output() openCardBEvent: EventEmitter<Event_t> = new EventEmitter()

  constructor(public dialog: MatDialog, public auth: AuthService, public ems: EventsMiddlemanService) {
  }

  ngOnInit(): void {
    this.event=this.input_event
    this.ems.countAttend(this.input_event).subscribe({
      next: (value) => this.count = value,
      error: error => console.log("Error fetching attendee count")
    })
  }

  // Function to show Card B version of Event
  onClickShowB(){

    const dialogRef = this.dialog.open(CardBComponent, {
      width: '70%',
      data : this.event
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  onAttend() {
    if (this.auth.user) {
      this.ems.createAttend(this.event)
      // you dirty dirty boy
      this.count ++;

      // this.ems.countAttend(this.event).subscribe({
      //   next: (value) => this.count = value,
      //   error: error => console.log("Error fetching attendee count")
      // })
    }

  }

  onUnattend() {
    if (this.auth.user) {
      this.ems.deleteAttend(this.event)
      this.count --;
      // this.ems.countAttend(this.event).subscribe({
      //   next: (value) => this.count = value,
      //   error: error => console.log("Error fetching attendee count")
      // })
    }
  }
}
