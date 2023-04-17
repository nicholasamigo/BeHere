import { Component, OnInit, Input, EventEmitter, Output, Inject, ViewChild, ElementRef} from '@angular/core';
import { Event_t, EventsMiddlemanService } from 'src/app/services/events-middleman.service';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-card-d',
  templateUrl: './card-d.component.html',
  styleUrls: ['./card-d.component.css']
})
export class CardDComponent {
  gmap_options : google.maps.MapOptions
  markerOptions : google.maps.MarkerOptions

  center: google.maps.LatLngLiteral;

  d: google.maps.LatLngLiteral = {lat: 0, lng: 0};

  lat:number = 0;
  lng:number = 0;
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



  constructor(private ems: EventsMiddlemanService, 
    private readonly snackBar : MatSnackBar,
    public dialogRef : MatDialogRef<CardDComponent>) {}

  ngOnInit(): void {
    this.gmap_options = {
      center: {lat: 0, lng: 0},
      minZoom: 10,
      zoom: 11
    };

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  updateSelectedLocation(event: google.maps.MapMouseEvent){
    this.d = event.latLng.toJSON();
    this.lat = this.d.lat;
    this.lng = this.d.lng;
  }

  // Emits closeCardBEvent to map-and-feed.html
  // onClickCloseB() {
  //   this.closeCardBEvent.emit();
  // }

  createEvent(){
    if (this.lat == 0) {
      this.snackBar.open(
        'Please click the map to select a location for your event.',
        'Close',
        {
          duration: 4000,
        },
      )
      return
    }
    else{
    let e = new Event_t(0, this.nameInputReference.nativeElement.value, this.bioInputReference.nativeElement.value,
      "",
      this.lat, 
      this.lng,
      "Balls avenue",
      this.dateInputReference.nativeElement.value,
      this.timeInputReference.nativeElement.value,
      false)
    this.ems.createEvent(e)
    this.snackBar.open(
      `Your event, ${e.name}, was successfully created.`,
      'Close',
      {
        duration: 4000,
      },
    )
    this.dialogRef.close()
    }
  }
}

