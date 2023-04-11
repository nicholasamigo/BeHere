import { Component, OnInit, Input, EventEmitter, Output, Inject, ViewChild, ElementRef} from '@angular/core';
import { Event_t, EventsMiddlemanService } from 'src/app/services/events-middleman.service';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-card-c',
  templateUrl: './card-c.component.html',
  styleUrls: ['./card-c.component.css']
})
export class CardCComponent {
  //event : Event_t
  gmap_options : google.maps.MapOptions
  markerOptions : google.maps.MarkerOptions
  markerCenterOptions : google.maps.MarkerOptions

  //Declerations for inputs
  public name: string;
  public date: string;
  public time: string;
  public bio: string;

  @ViewChild('nameInput')
  nameInputReference!: ElementRef;

  @ViewChild('dateInput')
  dateInputReference!: ElementRef;

  @ViewChild('timeInput')
  timeInputReference!: ElementRef;

  @ViewChild('bioInput')
  bioInputReference!: ElementRef;

  //@Input() input_event : Event_t

  @Output() closeCardBEvent: EventEmitter<void> = new EventEmitter()

  constructor(@Inject(MAT_DIALOG_DATA) public event: Event_t, private ems: EventsMiddlemanService) {}

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
    this.markerCenterOptions = {
      optimized: false,
      position: {lat: this.event.lat, lng: this.event.lng}
    }
  }

  // Emits closeCardBEvent to map-and-feed.html
  // onClickCloseB() {
  //   this.closeCardBEvent.emit();
  // }

  editEvent(){
    let e = new Event_t(this.event.id, this.nameInputReference.nativeElement.value, this.bioInputReference.nativeElement.value,
      "",
      this.event.lat, 
      this.event.lng,
      "Balls avenue",
      this.dateInputReference.nativeElement.value,
      this.timeInputReference.nativeElement.value)
    this.ems.editEvent(e)
    .subscribe({
      // Observable parameter
      next: data => console.log('Event edited successfully'),
      error: error => console.error('Error updating event', error)
    });
  }
}

