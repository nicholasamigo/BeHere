import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event_t } from 'src/app/services/events-middleman.service';
import { MatDialog } from '@angular/material/dialog';
import { CardBComponent } from '../card-b/card-b.component';
import { CardCComponent } from '../card-c/card-c.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventsMiddlemanService } from 'src/app/services/events-middleman.service';
// import { CardDComponent } from 'src/app/card-d/card-d.component';

// use these to trigger an event in the map-n-feed component
// when a card C (edit) dialog gets closed. 

@Component({
  selector: 'app-card-a-noedit',
  templateUrl: './card-a-noedit.component.html',
  styleUrls: ['./card-a-noedit.component.css']
})
export class CardAComponentNoEdit implements OnInit{


  event : Event_t
  count : number

  @Input() input_event : Event_t

  @Output() openCardBEvent: EventEmitter<Event_t> = new EventEmitter()

  @Output() closedCardCEvent: EventEmitter<Event_t> = new EventEmitter()


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
      width: '80%',
      minHeight: '80%',
      data : this.event
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }

  // onClickShowD(){

  //   const dialogRef = this.dialog.open(CardDComponent, {
  //     width: '70%',
  //     data : this.event
  //   });
  // }
}
