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
- Added a OAuth user-login system with Google Authprovider and Firebase API. Required external configuration of Firebase and Google Console
- Implemented further end-to-end testing with Cypress.

# Sprint Notes
For this sprint, we were successful in closing multiple issues. AJ implemented a Google login service using OAuth 2. After login, the front end is able to get data about the current user, like display name and and profile pciture. Nick worked on finalizing the content of the Event class, displaying proper information on the front-end, unit tests. John implemented a POST REST-API call in the back-end and integrated it with user input so users can create events in the backend.

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

