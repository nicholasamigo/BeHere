import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event_t } from 'src/app/services/events-middleman.service';

@Component({
  selector: 'app-card-a',
  templateUrl: './card-a.component.html',
  styleUrls: ['./card-a.component.css']
})
export class CardAComponent implements OnInit{


  event : Event_t

  @Input() input_event : Event_t

  @Output() openCardBEvent: EventEmitter<Event_t> = new EventEmitter()

  ngOnInit(): void {
    this.event=this.input_event
  }

  // Function to show Card B version of Event
  onClickShowB(){
    this.openCardBEvent.emit(this.event);
  }
}
