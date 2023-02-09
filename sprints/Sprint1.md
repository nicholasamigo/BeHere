# Sprint 1 Documentation - Nicholas Amigo, Aidan (AJ) Persaud, and John Glass - CEN3031 - February 2023

## Link to the Front-End Demo:
https://youtu.be/CiixzqXIafo

## Link to the Back-End Demo:
https://www.youtube.com/watch?v=uCZShVcOau0
### Back-End demo part 2 (quick update):
https://youtu.be/tp3eQJp5xPU

## Total User Stories:
1. Account login/creation
	- As a BeHere user, I want an account creation system so I can access exclusive website features such as friend lists and personalized events.
		- I am able to create an account.
		- I am able to login to an account.
		- When logged in, I am able to create events on the calendar/map.
2. Informative calendar widget
	- As a BeHere visitor, I want a calendar interface to display interesting events so that they are easily accessible, organized, and work for my schedule.
		- I am able to view a list of events occurring on a given day.
		- I am able to identify “busy” days on a monthly/weekly calendar, informed by visual nodes.
		- I can click on an existing event for more details.
3. User account database + login API
	- As a Front-End developer of BeHere, I want a database to store account users + an API from the Back-End so that I can pull event data and display on the map with event details.
		- Database exists in Go, implemented with GORM.
		- Database is populated with at least two accounts.
		- Some REST API functionality, able to get and set fields.
		- Front-End signed off on this, and they made it work with their login page.
4. Event database + REST API for getting/setting data
	- As a Front-End developer of BeHere, I want a database to store events + an API from the Back-End so that I can pull event data and display on the map with event details.
		- Database exists in Go, implemented with GORM.
		- Database is populated with at least two “events”.
		- Some REST API functionality that is able to get and set fields.
5. Interactive map with events and geolocation
	- As a novice user of BeHere, I want a detailed, interactive, and visually-appealing map so that I could find events I could be interested in near my location.
		- The map should be navigable either by search or dragging.
		- The map should center on the current location of the user.
		- I should have at least one sample event to click on and show data about.

## User Stories Intended to be Completed:
Interactive map with events and geolocation
	- As a novice user of BeHere, I want a detailed, interactive, and visually-appealing map so that I could find events I could be interested in near my location.
		- The map should be navigable either by search or dragging.
		- The map should center on the current location of the user.
		- I should have at least one sample event to click on and show data about.

## User Stories we Completed:
Although we did not fully complete the intended user story, we were able to complete two of the three criteria for it as visible on GitHub. The only remaining task is the implementation of a sample event that displays data. Our next step is to make the information display on the side of the map rather than the small window above the location.

## User Stories we are Unable to Complete:
We were unable to complete the remaining user stories because they are scheduled for the near future. We will prioritize one user story at a time, and will go through the remaining soon.
