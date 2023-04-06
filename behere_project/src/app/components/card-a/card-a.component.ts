import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event_t } from 'src/app/services/events-middleman.service';
import { MatDialog } from '@angular/material/dialog';
import { CardBComponent } from '../card-b/card-b.component';
import { CardCComponent } from '../card-c/card-c.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-card-a',
  templateUrl: './card-a.component.html',
  styleUrls: ['./card-a.component.css']
})
export class CardAComponent implements OnInit{


  event : Event_t

  @Input() input_event : Event_t

  @Output() openCardBEvent: EventEmitter<Event_t> = new EventEmitter()


  constructor(public dialog: MatDialog, readonly auth: AuthService,) {}

  ngOnInit(): void {
    this.event=this.input_event
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

  onClickShowC(){

    const dialogRef = this.dialog.open(CardCComponent, {
      width: '70%',
      data : this.event
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })
  }
}
