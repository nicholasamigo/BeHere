package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
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
	Lat    float32
	Lng    float32
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
	getEventsAroundLocation(db, e1.Lat, e1.Lng, 50)
	fmt.Printf("--------------------")
	var e3 Event
	e3.Lat, e3.Lng = 1600, -800
	e3.Name = "CreateEvent"
	e3.HostId = 2
	createEvent(db, e3)
	getEventsAroundLocation(db, e3.Lat, e3.Lng, 50)
	fmt.Printf("--------------------")
	ed_ID := getEventID(db, e3)
	e3.Lat, e3.Lng = 9000, 9000
	e3.Name = "EDITED_EVENT"
	e3.HostId = 3
	editEvent(db, ed_ID, e3)
	fmt.Printf("--------------------")
	getEventsAroundLocation(db, e3.Lat, e3.Lng, 50)

	// Update - update person's name
	//db.Model(&p1).Update("name", "John")
	// Delete - delete product
	//db.Delete(&p1, 1)

	/* Server initializaiton */
	r := mux.NewRouter()

	r.HandleFunc("/hello-world", helloWorld)
	//r.HandleFunc("/create-account", createAccount)
	//r.HandleFunc("/delete-account", deleteAccount)

	// Solves Cross Origin Access Issue
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:4200"},
	})
	handler := c.Handler(r)

	srv := &http.Server{
		Handler: handler,
		Addr:    ":" + os.Getenv("PORT"),
	}
	//fmt.Print(srv.Addr)
	log.Fatal(srv.ListenAndServe())
}

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

func getEventsAroundLocation(db *gorm.DB, Lat float32, Lng float32, radius uint) []Event {
	var result []Event
	db.Where("Lat <= ? AND Lng <= ?", Lat, Lng).Find(&result)
	/*
		for i := 0; i < len(result); i++ {
			fmt.Print(result[i].Lat)
			fmt.Print("   ")
			fmt.Print(result[i].Lng)
			fmt.Print("|")
			fmt.Print(result[i].Model.ID)
			fmt.Print("|")
		}
	*/

	return result
}

func getEventID(db *gorm.DB, e Event) uint {
	var result Event
	db.Where("HostId = ? AND Name = ? AND Lat = ? AND Lng = ?", e.HostId, e.Name, e.Lat, e.Lng).Find(&result)

	return result.Model.ID
}

func getEventByID(db *gorm.DB, id uint) Event {
	var result Event
	// Get all records
	db.Find(&result, id)
	//fmt.Print(result.Name)
	// SELECT * FROM users;
	return result
}

func createEvent(edb *gorm.DB, event Event) bool {
	edb.Create(&event)
	return true
}

func editEvent(edb *gorm.DB, id uint, event Event) bool {
	var result Event
	// Get all records
	db.Find(&result, id)

	db.Find(id).Update("Name", event.Name)
	db.Find(id).Update("Lat", event.HostId)
	db.Find(id).Update("Lat", event.Lat)
	db.Find(id).Update("Lng", event.Lng)

	return true
}
