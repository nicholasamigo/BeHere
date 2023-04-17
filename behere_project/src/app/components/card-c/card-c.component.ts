import { Component, OnInit, Input, EventEmitter, Output, Inject, ViewChild, ElementRef} from '@angular/core';
import { Event_t, EventsMiddlemanService } from 'src/app/services/events-middleman.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


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

  constructor(@Inject(MAT_DIALOG_DATA) public event: Event_t, 
      private ems: EventsMiddlemanService, 
      public dialogRef : MatDialogRef<CardCComponent>,
      private readonly snackBar: MatSnackBar,
      ) {}

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

  confirmDelete() : void {
    if(confirm("Are you sure you want to delete this event?\n\nThis action cannot be undone."))
    {
      this.ems.deleteEvent(this.event)
      console.log("Deleted")
      this.closeDialog()
      this.snackBar.open(
        `${this.event.name} was deleted.`,
        'Close',
        {
          duration: 4000,
        },
      )
    }
  }

  confirmComplete() : void {
    if(confirm("Are you sure you want to mark this event completed?\n\nThis action cannot be undone."))
    {
      this.ems.completeEvent(this.event)
      console.log("Completed")
      this.closeDialog()
      this.snackBar.open(
        `${this.event.name} was marked completed.`,
        'Close',
        {
          duration: 4000,
        },
      )
    }
  }

  // Emits closeCardBEvent to map-and-feed.html
  // onClickCloseB() {
  //   this.closeCardBEvent.emit();
  // }

  editEvent(){
    let e = new Event_t(this.event.id,              //id
      this.nameInputReference.nativeElement.value,  //name
      this.bioInputReference.nativeElement.value,   //bio
      "",
      this.event.lat, 
      this.event.lng,
      "Default",
      this.dateInputReference.nativeElement.value,
      this.timeInputReference.nativeElement.value,
      false)
    this.ems.editEvent(e)
    this.snackBar.open(
      `Your event, ${e.name}, was successfully edited.`,
      'Close',
      {
        duration: 4000,
      },
    )
  }

  closeDialog() {
    this.dialogRef.close();
  }
}