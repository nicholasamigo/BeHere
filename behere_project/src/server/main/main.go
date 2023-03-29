package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"utils"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Person struct {
	gorm.Model
	Name string
	Age  uint
	// loc  Location
	// profile picture
	// friends
}

// FUCK OFF GORM
// Make sure you USE CAPS or your shit won't show up
// in the DB
type Event struct {
	gorm.Model
	Name   string
	HostId uint
	Lat    float64
	Lng    float64
}
type AttendRelation struct {
	gorm.Model
	PID uint
	EID uint
}

// Global declaration of the database
var db *gorm.DB

func main() {
	var err error
	/* Database initialization */
	db, err = gorm.Open(sqlite.Open("test2.db"), &gorm.Config{})
	if err != nil {
		println(err)
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(Person{}, Event{}, AttendRelation{})

	// Testing here. Comment these out when running the server
	//john_test_funcs()
	//aj_populate()

	/* Server initializaiton */
	r := mux.NewRouter()

	r.HandleFunc("/hello-world", helloWorld)
	r.HandleFunc("/create-event", restCreateEvent)
	r.HandleFunc("/getEventsAroundLocation", restGetEventsAroundLocation)
	//r.HandleFunc("/create-account", createAccount)
	//r.HandleFunc("/delete-account", deleteAccount)

	// Solves Cross Origin Access Issue
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
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
	e1 := Event{Name: "Party at AJs!", HostId: 1, Lat: 29.644954782334302, Lng: -82.35255807676796}
	e2 := Event{Name: "Dinner at Johns", HostId: 1, Lat: 29.669247750220627, Lng: -82.33697355656128}
	e3 := Event{Name: "Pool Night at Nicks", HostId: 1, Lat: 29.685355319870283, Lng: -82.38572538761596}
	db.Create(&e1)
	db.Create(&e2)
	db.Create(&e3)
}

func john_test_funcs() {
	// Create

	var h1 Person
	var a1 Person
	var a2 Person
	var a3 Person

	h1.Name = "Host"
	h1.Age = 21
	a1.Name = "Attendee_1"
	a1.Age = 22
	a2.Name = "Attendee_2"
	a2.Age = 23
	a3.Name = "Attendee_3"
	a3.Age = 31

	/*
		var hostArray = []Person{h1}
		var attendeeArray1 = []Person{a1, a2}
		var attendeeArray2 = []Person{a3}
	*/

	var e1 Event
	e1.Name = "metro ping"
	e1.Lat, e1.Lng = 29.633665697496742, -82.37285317141043
	e1.HostId = 1

	var e2 Event
	e2.Lat, e2.Lng = 29.63681751889846, -82.37009641100245
	e2.Name = "idek"
	e2.HostId = 2

	db.Create(&Event{Name: "wtf", Lat: 29.633665697496742, Lng: -82.37285317141043, HostId: 4})
	db.Create(&e1)
	db.Create(&e2)

	db.Create(&Person{Name: "Golang w GORM Sqlite", Age: 20})
	/*
		db.Create(&Person{ID: 2, Name: "aj", Age: 20})
		db.Create(&Person{ID: 3, Name: "john", Age: 19})
		db.Create(&Person{ID: 4, Name: "Nick", Age: 21})
	*/

	// Read
	var p1 Person
	db.First(&p1) // should find person with integer primary key, but just gets first record
	fmt.Print(p1.Name)

	//Testing all of the event helper functions
	getEventsAroundLocation(db, e1.Lat, e1.Lng, 50)
	fmt.Println("--------------------")
	var e3 Event
	e3.Lat, e3.Lng = 1600, -800
	e3.Name = "CreateEvent"
	e3.HostId = 2
	createEvent(db, e3)
	getEventsAroundLocation(db, e3.Lat, e3.Lng, 50)
	fmt.Println("--------------------")
	ed_ID := getEventID(db, e3)
	e3.Lat, e3.Lng = 9000, 9000
	e3.Name = "EDITED_EVENT"
	e3.HostId = 3
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

	var p2 Person
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
	/*
		for i := 0; i < len(result); i++ {
			fmt.Print(result[i].Lat)
			fmt.Print("   ")
			fmt.Print(result[i].Lng)
			fmt.Print("|")
			fmt.Print(result[i].Model.ID)
			fmt.Print("|")
			fmt.Println("--------------------")
		}
	*/

	return result
}

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
	db.Where("host_id = ? AND Name = ? AND Lat = ? AND Lng = ?", e.HostId, e.Name, e.Lat, e.Lng).Find(&result)

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
func createEvent(edb *gorm.DB, event Event) bool {
	edb.Create(&event)
	return true
}

// Function that edits an event
// Takes in an event id and replaces it with all the member attributes of a given event
func editEvent(edb *gorm.DB, id uint, event Event) bool {
	// Get all records
	db.Model(&Event{}).Where("id = ?", id).Update("Name", event.Name)
	db.Model(&Event{}).Where("id = ?", id).Update("host_id", event.HostId)
	db.Model(&Event{}).Where("id = ?", id).Update("Lat", event.Lat)
	db.Model(&Event{}).Where("id = ?", id).Update("Lng", event.Lng)

	return true
}
