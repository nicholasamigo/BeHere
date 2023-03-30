# Sprint 3 - Nicholas Amigo, Aidan (AJ) Persaud, and John Glass - CEN3031 - March 2023

## Demo Links:
[Front End Demo (Nick and Aidan)](https://youtu.be/9fOnqLQ0wVg)
[Back End Demo (John)](https://youtu.be/w-aUFNLU-OQ)
[Cypress Testing Demo]()

# Sprint Accomplishments
- Implemented a functional event-creation system on the page itself.
- Fixed bugs and errors with displaying information in the sidebar, such as map stuttering after clicking events.
- Finalized event variables and incorporated their functionality from the backend.
- Added further design to the presentation of event variables, such as bold and italics to make information more organized.
- Implemented a rest-function to create an event in the database.
- Created a front-end form to call the respective rest-function.
- Added a user-login system with the use of Firebase.
- Implemented further end-to-end testing with Cypress.

# Sprint Notes
For this sprint, we were successful in closing multiple issues. AJ worked on the creation of new events from the front-end, Nick worked on finalizing the content of the Event class and displaying proper information on the front-end, and John worked on the back-end functionality of the new event system.

# Closed Issues
- Account login/creation
- Revise event information and display proper information
- Implement "Create Event" Function

# Unit Tests

## Front End Tests
- Test login functionality.
- Test logout functionality.
- Test temporary "Create Event" button with inputted parameters.

## Backend API
- Test every database query function wrapper.
- All tests located in main.go under `john_testing_func()`

# Implemented Functions

func restCreateEvent - Function to restfully create an event as requested by the Front-End.

```
func restCreateEvent(w http.ResponseWriter, r *http.Request) {
	fmt.Print("asd")
	query := r.URL.Query()
	name := query.Get("name")
	lat := query.Get("lat")
	lng := query.Get("lng")

	var e Event
	e.Name = name
	e.HostId = 0
	lt, err := strconv.ParseFloat(lat, 64)
	if err != nil {
		fmt.Println(err)
	}
	lg, err := strconv.ParseFloat(lng, 64)
	if err != nil {
		fmt.Println(err)
	}
	e.Lat = lt
	e.Lng = lg

	createEvent(db, e)

	// call DB func to get relevant events
	eventlist := getEventsAroundLocation(db, 0, 0, 0)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(eventlist)
}
```
---

