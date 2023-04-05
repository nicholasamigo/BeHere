import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { Event_t } from 'src/app/services/events-middleman.service';

@Component({
  selector: 'app-card-b',
  templateUrl: './card-b.component.html',
  styleUrls: ['./card-b.component.css']
})
export class CardBComponent implements OnInit{
  event : Event_t

  @Input() input_event : Event_t

  @Output() closeCardBEvent: EventEmitter<void> = new EventEmitter()

  ngOnInit(): void {
    this.event=this.input_event
  }

  // Emits closeCardBEvent to map-and-feed.html
  onClickCloseB() {
    this.closeCardBEvent.emit();
  }
}