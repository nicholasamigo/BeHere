import { Component, OnInit, Input, EventEmitter, Output, Inject} from '@angular/core';
import { Event_t } from 'src/app/services/events-middleman.service';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-card-b',
  templateUrl: './card-b.component.html',
  styleUrls: ['./card-b.component.css']
})
export class CardBComponent implements OnInit{
  //event : Event_t
  gmap_options : google.maps.MapOptions
  markerOptions : google.maps.MarkerOptions

  //@Input() input_event : Event_t

  @Output() closeCardBEvent: EventEmitter<void> = new EventEmitter()

  constructor(@Inject(MAT_DIALOG_DATA) public event: Event_t) {}

  ngOnInit(): void {
    //this.event=this.input_event

    this.gmap_options = {
      center: {lat: this.event.lat, lng: this.event.lng},
      minZoom: 12,
      zoom: 16
    };

    this.markerOptions = {
      optimized: false,
      position: {lat: this.event.lat, lng: this.event.lng}
    }
  }

  // Emits closeCardBEvent to map-and-feed.html
  // onClickCloseB() {
  //   this.closeCardBEvent.emit();
  // }
}