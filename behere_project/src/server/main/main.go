package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
	"utils"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

/*-------------STRUCT DEF BEGIN------------------*/

type User struct {
	gorm.Model
	Name  string
	Email string `gorm:"unique;not null"`
}

// FUCK OFF GORM
// Make sure you USE CAPS or your shit won't show up
// in the DB
type Event struct {
	gorm.Model
	Name          string
	Bio           string
	HostId        string `gorm:"not null"` // ensures there is always a host to every event
	Lat           float64
	Lng           float64
	Address       string
	Date          string
	Time          string
	DeletedFlag   bool
	CompletedFlag bool

	// Will be implemented later with specific classes because they are dynamic.
	//FriendsInvolved AttendRelation
	//Attendees uint
	//EventTags VAR
	//Distance float32
}
type AttendRelation struct {
	PID       string `gorm:"primaryKey"`
	EID       uint   `gorm:"primaryKey";autoIncrement:false"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

/*-------------STRUCT DEF END------------------*/

/*--Start Pseudo code for database access------*/
/*

Events
- Get Events around a radius: reduces load on the browser, don't need to store EVERY event.
	- Used on feed screen
	- Should not pull archived (deleted/completed events)
- Get all events hosting
	- Used on both Feed and My Events screen
- Get all events attending (splitting because easier to implement in Go)
	- Used on both Feed and My Events screen
	- Whether completed or archived is handled by front-end, don't worry about it
- User exists?

*/
/*--End Pseudo code for database access--------*/

// Global declaration of the database
var db *gorm.DB

func main() {
	var err error
	/* Database initialization */
	db, err = gorm.Open(sqlite.Open("../internal/test2.db"), &gorm.Config{})
	if err != nil {
		println(err)
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(User{}, Event{}, AttendRelation{})

	// Testing here. Comment these out when running the server
	//john_test_funcs()
	//aj_populate()

	//nick_test()

	/* Server initializaiton */
	r := mux.NewRouter()

	r.HandleFunc("/hello-world", helloWorld)
	// Sends the event ID back.
	r.HandleFunc("/create-event", restCreateEvent).Methods("POST")
	r.HandleFunc("/edit-event", restEditEvent).Methods("POST")
	r.HandleFunc("/getEventsAroundLocation", restGetEventsAroundLocation)
	r.HandleFunc("/createAttend", restCreateAttend).Methods("POST")
	r.HandleFunc("/deleteAttend", restDeleteAttend).Methods("POST")
	r.HandleFunc("/countAttend", restCountAttend)
	r.HandleFunc("/getAttendingEventIDs", restGetAttendingEventIDs)
	r.HandleFunc("/getDeletedAttendedEvents", restGetDeletedAttendedEvents)
	r.HandleFunc("/deleteEvent", restDeleteEvent).Methods("POST")
	r.HandleFunc("/completeEvent", restCompleteEvent).Methods("POST")

	//r.HandleFunc("/getUserID", restGetUserID)
	//r.HandleFunc("/putUser", restPutUser).Methods("PUT")
	//r.HandleFunc("/create-account", createAccount)
	//r.HandleFunc("/delete-account", deleteAccount)

	// Solves Cross Origin Access Issue
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:4200"},
		AllowedMethods: []string{"GET", "POST", "PUT"},
	})
	handler := c.Handler(r)

	srv := &http.Server{
		Handler: handler,
		Addr:    ":" + os.Getenv("PORT"),
	}
	//fmt.Print(srv.Addr)
	log.Fatal(srv.ListenAndServe())
}

func aj_populate() {
	// let dummy1 = new Event_t(1, "Party at AJs!", 1, 29.644954782334302, -82.35255807676796);
	// let dummy2 = new Event_t(2, "Dinner at Johns", 1, 29.669247750220627, -82.33697355656128);
	// let dummy3 = new Event_t(3, "Pool Night at Nicks", 1, 29.685355319870283, -82.38572538761596);
	e1 := Event{Name: "Party at AJs!", HostId: "1", Lat: 29.644954782334302, Lng: -82.35255807676796}
	e2 := Event{Name: "Dinner at Johns", HostId: "1", Lat: 29.669247750220627, Lng: -82.33697355656128}
	e3 := Event{Name: "Pool Night at Nicks", HostId: "1", Lat: 29.685355319870283, Lng: -82.38572538761596}
	db.Create(&e1)
	db.Create(&e2)
	db.Create(&e3)
}

func nick_test() {
	event1 := Event{Name: "Basketball at Nick's", HostId: "25", Lat: 29.744954782334302, Lng: -82.45255807676796,
		Address: "9524 sw 101st Terr", Date: "2/4/2023", Time: "3:00 pm"}
	db.Create(&event1)

	event2 := Event{Name: "Ice Cream Time", HostId: "12", Lat: 29.544954782334302, Lng: -81.45255807676796,
		Address: "1232 sw 3rd Ave", Date: "3/21/2023", Time: "5:00 pm"}
	db.Create(&event2)
}

func john_test_funcs() {
	// Create

	var h1 User
	var a1 User
	var a2 User
	var a3 User

	h1.Name = "Host"
	h1.Email = "joe@butts.com"
	a1.Name = "Attendee_1"
	a1.Email = "Nick@butts.com"
	a2.Name = "Attendee_2"
	a2.Email = "AJ@butts.com"
	a3.Name = "Attendee_3"
	a1.Email = "John@butts.com"

	/*
		var hostArray = []Person{h1}
		var attendeeArray1 = []Person{a1, a2}
		var attendeeArray2 = []Person{a3}
	*/

	var e1 Event
	e1.Name = "metro ping"
	e1.Lat, e1.Lng = 29.633665697496742, -82.37285317141043
	e1.HostId = "1"

	var e2 Event
	e2.Lat, e2.Lng = 29.63681751889846, -82.37009641100245
	e2.Name = "idek"
	e2.HostId = "2"

	db.Create(&Event{Name: "wtf", Lat: 29.633665697496742, Lng: -82.37285317141043, HostId: "4"})
	db.Create(&e1)
	db.Create(&e2)

	db.Create(&User{Name: "Golang w GORM Sqlite", Email: "Test@yahoo.com"})
	/*
		db.Create(&Person{ID: 2, Name: "aj", Age: 20})
		db.Create(&Person{ID: 3, Name: "john", Age: 19})
		db.Create(&Person{ID: 4, Name: "Nick", Age: 21})
	*/

	// Read
	var p1 User
	db.First(&p1) // should find person with integer primary key, but just gets first record
	fmt.Print(p1.Name)

	//Testing all of the event helper functions
	getEventsAroundLocation(db, e1.Lat, e1.Lng, 50)
	fmt.Println("--------------------")
	var e3 Event
	e3.Lat, e3.Lng = 1600, -800
	e3.Name = "CreateEvent"
	e3.HostId = "2"
	createEvent(db, e3)
	getEventsAroundLocation(db, e3.Lat, e3.Lng, 50)
	fmt.Println("--------------------")
	ed_ID := getEventID(db, e3)
	e3.Lat, e3.Lng = 9000, 9000
	e3.Name = "EDITED_EVENT"
	e3.HostId = "3"
	editEvent(db, ed_ID, e3)
	fmt.Println("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
	getEventsAroundLocation(db, e3.Lat, e3.Lng, 50)
	fmt.Println("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")

	// Update - update person's name
	//db.Model(&p1).Update("name", "John")
	// Delete - delete product
	//db.Delete(&p1, 1)

}

// Reference Function for RestFULLY interacting with frontend from backend
func helloWorld(w http.ResponseWriter, r *http.Request) {

	var p2 User
	db.First(&p2)

	var data = struct {
		Title string `json:"title"`
	}{
		Title: p2.Name,
	}

	jsonBytes, err := utils.StructToJSON(data)
	if err != nil {
		fmt.Print(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBytes)
	return
}

// ------------------ REST FUNCTIONS BEGIN ---------------------

// Reference Function for RestFULLY interacting with frontend from backend
func restGetEventsAroundLocation(w http.ResponseWriter, r *http.Request) {
	// extract query params from URL
	query := r.URL.Query()
	lat := query.Get("lat")
	lng := query.Get("lng")
	radius := query.Get("radius")

	// Convert parameter values to appropriate types
	latValue, err := strconv.ParseFloat(lat, 64)
	if err != nil {
		http.Error(w, "Invalid 'lat' parameter", http.StatusBadRequest)
		return
	}
	lngValue, err := strconv.ParseFloat(lng, 64)
	if err != nil {
		http.Error(w, "Invalid 'lng' parameter", http.StatusBadRequest)
		return
	}
	radiusValue, err := strconv.ParseFloat(radius, 64)
	if err != nil {
		http.Error(w, "Invalid 'radius' parameter", http.StatusBadRequest)
		return
	}

	fmt.Println("Received", latValue, lngValue, radiusValue)

	// call DB func to get relevant events
	eventlist := getEventsAroundLocation(db, latValue, lngValue, radiusValue)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(eventlist)
}

func restCreateEvent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Creating event...")
	/*
		query := r.URL.Query()
		name := query.Get("name")
		lat := query.Get("lat")
		lng := query.Get("lng")
	*/

	// Read the request body into a byte array
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

	id, err := createEvent(db, newEvent)
	if err != nil {
		http.Error(w, "Failed to create entry in database", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	// Return the event ID! this will be helpful for the front end to get immediate feedback.

	json.NewEncoder(w).Encode(id)
}

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

func restGetDeletedAttendedEvents(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Getting all previous events attended...")

	query := r.URL.Query()
	uid := strings.TrimSpace(query.Get("uid"))
	fmt.Println("Received uid:", uid)
	previousevents := getDeletedAttendedEvents(db, db, uid)

	fmt.Println("Query res:", previousevents)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(previousevents)
}

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

func restCreateAttend(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Creating attendrelation...")

	// Read the request body into a byte array
	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	// Parse the request body into a JSON object
	var newAttend AttendRelation
	err = json.Unmarshal(reqBody, &newAttend)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	err = createAttend(db, newAttend)
	if err != nil {
		http.Error(w, "Most likely, entry already existed", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	// Send something back as proof of life. THis value probably ignored by
	// front end
	json.NewEncoder(w).Encode(newAttend)
}

func restDeleteAttend(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Deleting attendrelation...")

	// Read the request body into a byte array
	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	// Parse the request body into a JSON object
	var newAttend AttendRelation
	err = json.Unmarshal(reqBody, &newAttend)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	err = deleteAttend(db, newAttend)
	if err != nil {
		http.Error(w, "Failed to delete entry from database", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newAttend)
}

// Receives an EID as param
func restCountAttend(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Counting attendrelation...")

	query := r.URL.Query()
	eid := query.Get("eid")

	// Convert parameter values to appropriate types
	eidValue, err := strconv.ParseUint(eid, 10, 64)
	if err != nil {
		http.Error(w, "Invalid 'eid' parameter", http.StatusBadRequest)
		return
	}

	count := countAttend(db, uint(eidValue))

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(count)
}

func restGetAttendingEventIDs(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Getting all EIDs you're attending...")

	query := r.URL.Query()
	uid := strings.TrimSpace(query.Get("uid"))

	fmt.Println("Received uid:", uid)

	// stringy already

	//count := countAttend(db, uint(eidValue))
	EIDS := getEIDsByUID(db, uid)

	fmt.Println("Query res:", EIDS)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(EIDS)
}

// Useless now
func restGetUserID(w http.ResponseWriter, r *http.Request) {
	// Read the request body into a byte array
	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	// Parse the request body into a JSON object
	var usr User
	err = json.Unmarshal(reqBody, &usr)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	usr_id := getUserIDbyEmail(db, usr.Email)
	if usr_id == -1 {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(usr_id)
}

// Useless now
func restPutUser(w http.ResponseWriter, r *http.Request) {

	// Read the request body into a byte array
	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	// Parse the request body into a JSON object
	var usr User
	err = json.Unmarshal(reqBody, &usr)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	// Check if exists
	fmt.Println("Checking if user exists in db")
	if !checkUser(db, usr.Email) {
		// If not, create the User
		createUser(db, usr)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(usr)
}

// ------------------ REST FUNCTIONS END -----------------------

// ------------------ GORM DB FUNCTIONS BEGIN ------------------

// Function that returns the Events within a specified square radius around a location
// Returns a list of Events
func getEventsAroundLocation(db *gorm.DB, Lat float64, Lng float64, radius float64) []Event {
	var result []Event
	//db.Where("((Lat <= ? AND Lat >= ?) OR (Lat >= ? AND Lat <= ?)) AND ((Lng <= ? AND Lng >= ?) OR (Lng >= ? AND Lng <= ?))", float32(math.Abs(float64(Lat)))+float32(math.Abs(float64(radius))), float32(math.Abs(float64(Lat)))-float32(math.Abs(float64(radius))), float32(math.Abs(float64(Lng)))+float32(math.Abs(float64(radius))),
	//	float32(math.Abs(float64(Lng)))+float32(math.Abs(float64(radius))), float32(math.Abs(float64(Lat)))+float32(math.Abs(float64(radius))), float32(math.Abs(float64(Lat)))-float32(math.Abs(float64(radius))), float32(math.Abs(float64(Lng)))+float32(math.Abs(float64(radius))),
	//	float32(math.Abs(float64(Lng)))+float32(math.Abs(float64(radius)))).Find(&result)

	eastBar := Lat + radius
	westBar := Lat - radius
	northBar := Lng + radius
	southBar := Lng - radius

	db.Where("lat >= ? AND lat <= ? AND lng >= ? AND lng <= ?", westBar, eastBar, southBar, northBar).Find(&result)

	return result
}

// ------------ BEGIN ATTENDEE FUNCS ---------------
func createAttend(db *gorm.DB, ar AttendRelation) error {
	result := db.Create(&ar)
	return result.Error
}

func deleteAttend(db *gorm.DB, ar AttendRelation) error {
	result := db.Delete(&ar)
	return result.Error
}

func countAttend(db *gorm.DB, eid uint) int64 {
	var count int64
	db.Model(&AttendRelation{}).Where("E_ID = ?", eid).Count(&count)
	return count
}

// -------------END ATTENDEE FUNCS -----------------

// Function that returns the Events within a specified square radius around a location
// Returns a list of Events
func getEventsWithinBounds(db *gorm.DB, swLat float64, swLng float64, neLat float64, neLng float64) []Event {
	var result []Event
	db.Where("lat >= ? AND lat <= ? AND lng >= ? AND lng <= ?", swLat, neLat, swLng, neLng).Find(&result)

	return result
}

// Function that returns the ID of a passed in event
func getEventID(db *gorm.DB, e Event) uint {
	var result Event
	// db.Where("host_id = ? AND Name = ? AND Lat = ? AND Lng = ?", e.HostId, e.Name, e.Lat, e.Lng).Find(&result)
	db.Where(&e).First(&result)
	return result.Model.ID
}

// Function that gets an Event by a given id
// This id is the id within the database
func getEventByID(db *gorm.DB, id uint) Event {
	var result Event
	// Get all records
	db.Find(&result, id)
	//fmt.Print(result.Name)
	// SELECT * FROM users;
	return result
}

// Function that takes in a passed in event and creates it within the database
// ret : error
func createEvent(edb *gorm.DB, event Event) (uint, error) {
	result := edb.Create(&event)
	return event.Model.ID, result.Error
}

// ret : error
func deleteEvent(edb *gorm.DB, event Event) error {
	result := edb.Delete(&event)
	return result.Error
}

// Marks an event as completed, then deletes it
func completeEvent(edb *gorm.DB, event Event) error {
	edb.Model(&event).Update("CompletedFlag", true)
	result := edb.Delete(&event)
	return result.Error
}

// Front end can sort out whether completed or deleted.
func getDeletedAttendedEvents(edb *gorm.DB, ardb *gorm.DB, uid string) []Event {
	EIDS := getEIDsByUID(ardb, uid)

	var deletedevents []Event
	edb.Unscoped().Find(&deletedevents, EIDS)
	return deletedevents
}

// Function that edits an event
// Takes in an event id and replaces it with all the member attributes of a given event
func editEvent(edb *gorm.DB, id uint, event Event) bool {
	// Get all records
	// db.Model(&Event{}).Where("id = ?", id).Update("Name", event.Name)
	// db.Model(&Event{}).Where("id = ?", id).Update("host_id", event.HostId)
	// db.Model(&Event{}).Where("id = ?", id).Update("Lat", event.Lat)
	// db.Model(&Event{}).Where("id = ?", id).Update("Lng", event.Lng)
	// db.Model(&Event{}).Where("id = ?", id).Update("Date", event.Date)
	// db.Model(&Event{}).Where("id = ?", id).Update("Time", event.Time)
	// db.Model(&Event{}).Where("id = ?", id).Update("Bio", event.Bio)
	//edb.Save(&event)
	edb.Model(&event).Omit("host_id").Updates(event)

	fmt.Print(id)
	return true
}

func createUser(udb *gorm.DB, user User) error {
	result := udb.Create(&user)
	return result.Error
}

func checkUser(udb *gorm.DB, email string) bool {
	var usrs []User
	udb.Where("email = ?", email).Find(&usrs)
	return len(usrs) > 0
}

// Return -1 for record not found
func getUserIDbyEmail(udb *gorm.DB, email string) int {
	var usr User
	err := udb.Where("email = ?", email).First(usr).Error
	if err != nil {
		return -1
	} else {
		return (int)(usr.Model.ID)
	}
}

func getEIDsByUID(ardb *gorm.DB, uid string) []int {
	var res []int
	ardb.Model(&AttendRelation{}).Where("p_id = ?", uid).Pluck("e_id", &res)
	return res
}

// ------------------ GORM DB FUNCTIONS END --------------------
