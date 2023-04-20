# Sprint 4 - Nicholas Amigo, Aidan (AJ) Persaud, and John Glass - CEN3031 - April 2023

# Demo Links:

## New Functionality
- [New Back End Demo (AJ)](https://youtu.be/O61IGqgA9z8)
- [New Front End Demo (Nick)](https://youtu.be/aZH00bqvshE)

## All Functionality 
- [Back End API (John)](https://youtu.be/ZjQZUB58rhM)
- [Front End Functionality (Nick)](https://youtu.be/XC_dGp4X4Bg)

## Testing
- [Cypress Testing Demo (John)](https://youtu.be/HsUYc3j148A)

# Sprint Accomplishments
- Implemented a "Card" component to encapsulate data and information about events.
- Implemented four different card classes: Card A, Card B, Card C, and Card D. Some are used to specifically display information, such as Card A and Card B, and some are able to be edited, such as Card C and Card D. All cards are variations of the main idea, such as an expanded view one like Card B.
- Implemented an animated blue icon that shows the current location on the map.
- Revised the "Create Event" functionality to store cards on the back-end.
- Added a unique user ID login system that matches host IDs.
- Created a "Middle Man" service that sends information between front-end and back-end.
- Constructed a card table on the home page that organizes and displays nearby events with filters including all, attending, and hosting.
- Implemented logged-in user exclusivity throughout the site, such as having only logged-in users host and create events.
- Made two different pages for the website: 'map and feed' and 'my events'. Map and feed represents the home page itself, and allows most functionality except creating events. My events is used to see all events and filter them further with completed and cancelled filters, along with allowing the user to create events.
- Cleaned up unnecessary comments and functions.
- Incorporated further visual elements to the website, such as a banner, logo, information icon, and more.
- Fixed multiple bugs and errors with front-end and back-end connectivity.
- Implemented more end-to-end testing using Cypress.

# Sprint Notes
This sprint was one of our most productive yet. Not only were we successful in closing the remaining issues, but we were able to completely rethink the front-end and back-end structures of our project. Now, our website incorporates cards to easily display information to the user, as well as easily store information in the back end. There are multiple variations of these cards, all of which have an important role in event creation and searching. Furthermore, our website has two seperate pages that each house exclusive features. One is for the map and quick view of cards, and the other is for card/event creation and more detailed views of cards. All three members performed substantial tasks for this sprint, with every member creating an essential part of our new website. In particular, AJ created most of the card classes and their functionalities, John incorporated cards into the back-end, and Nick created the second page of the website to house further information about events. These tasks were the most pivotal accomplishments of this sprint, with each member doing much more. Overall, this was our most successful sprint yet, and our entire website looks, feels, performs, and functions much better than it has in previous sprints.

# Closed Issues
- Reset View Button Implementation
- BeHere Logo Implementation
- (Bug) Blue Marker Overlay
- Code and File Organization
- Further Card B Implementation
- (Bug) Card B Moveable Map Implementation
- Card B Attend Bug
- Relationship Between Card A and GMap Marker
- Page 2 (My Events Page)
- Redo Create Event Functionality
- Update Create Event with User ID
- Database Updates - User and Events
- AttendeeCount and List Query
- Implement Editable Condensed and Expanded Event Cards
- Front Page Event Display Table
- Expanded Event Card Implementation
- Condensed Event Card Implementation
- And Others

# Unit Tests
Because we overhauled most of our website since the past sprint, we also decided to use similar tests, as they are completely different now and require more specifications to pass. As such, the previous sprint's tests aren't functional anymore, and this was a good time to redevelop them.

## Front End Tests
- [Blocks] - Test that the user is unable to create an event if they are not logged in.
- [ClickMarker] - Test marker clicking functionality and that clicker is accurate.

## Back End Tests
- [CreateEvent] - Test event creation functionality through back-end and make sure it displays properly.
- [Login] - Test log in functionality and that the user has access to other features such as "Create an Event".

# Backend API
- Test2.db stores all events and event information.
- Main.go contains restful implementations of events and event functions.
- Backend API works hand-in-hand with the middle-man service.
- Uses http requests for calling back-end functions.
- Is fully linked to the front-end.

# Implemented Functions
There are multiple new functions we implemented into our project for this sprint, so here are some that encapsulate both front end and back end changes.

func restDeleteEvent - Function to restfully delete an event as requested by the Front-End.
```
func restDeleteEvent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Deleting event...")
	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	var deletingEvent Event
	err = json.Unmarshal(reqBody, &deletingEvent)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	err = deleteEvent(db, deletingEvent)
	if err != nil {
		http.Error(w, "Failed to delete entry from database", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(deletingEvent)
}
```
---

func restCompleteEvent - Function to restfully complete an event as requested by the Front-End.
```
func restCompleteEvent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Completing event...")
	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	var completingEvent Event
	err = json.Unmarshal(reqBody, &completingEvent)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	err = completeEvent(db, completingEvent)
	if err != nil {
		http.Error(w, "Failed to complete/delete entry from database", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(completingEvent)
}
```
---

func restEditEvent - Function to restfully edit an event as requested by the Front-End.

```
func restEditEvent(w http.ResponseWriter, r *http.Request) {

	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	// Parse the request body into a JSON object
	var newEvent Event
	err = json.Unmarshal(reqBody, &newEvent)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	editEvent(db, newEvent.Model.ID, newEvent)

	w.Header().Set("Content-Type", "application/json")
	// Send something back as proof of life. THis value probably ignored by
	// front end
	json.NewEncoder(w).Encode(newEvent)
}
```
---

func onClickShowD - Called by the "Create Event" button and displays an editable Card-D component.
```
onClickShowD(){
    console.log("asd")

    const dialogRef = this.dialog.open(CardDComponent, {
      width: '80%'
    });
}
```
---

func scrollToCard - Connected with the map-and-feed component and scrolls to a certain event card when a specific event is clicked, and vice-versa.
```
scrollToCard() {
    const card = document.getElementById(this.selectedEvent.id.toString());
    this.bluemarker.setAnimation(google.maps.Animation.BOUNCE)
    this.bluemarker.setPosition({lat: this.selectedEvent.lat, lng: this.selectedEvent.lng})
    this.bluemarker.setMap(this.map.googleMap)
    if (card)
      card.scrollIntoView({ behavior: 'smooth' })
  }
```
---

func onMarkerClick - Scrolls to the corresponding card in the card container that matches the event marker clicked.
```
onMarkerClick(event: Event_t) {
    this.selectedEvent = event
    const card = document.getElementById(event.id.toString());
    if (!card) // card not found, go to Nearby Events tab
    {
      this.tabGroup.selectedIndex = 0
      console.log("Tried to switch tabs")
    }
    else{
      this.scrollToCard()
    }
  }
```
---