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

type Location struct {
	x float32
	y float32
	z float32
}

type Person struct {
	ID   uint `gorm:"primarykey"`
	Name string
	Age  uint
	// loc  Location
	// profile picture
	// friends
}

type Event struct {
	loc       Location
	hosts     []Person
	attendees []Person
}

// Global declaration of the database
var db *gorm.DB
var eventDB *gorm.DB

func main() {
	var err error
	/* Database initialization */
	db, err = gorm.Open(sqlite.Open("src/server/internal/test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	eventDB, err = gorm.Open(sqlite.Open("src/server/internal/events.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Print("World!")

	// Migrate the schema
	db.AutoMigrate(Person{})
	eventDB.AutoMigrate(Event{})

	// Create
	var p1Loc Location
	p1Loc.x = 50.0
	p1Loc.y = 100.0
	p1Loc.z = 50.0

	var h1 Person
	var a1 Person
	var a2 Person
	var a3 Person

	h1.ID = 2
	h1.Name = "Host"
	h1.Age = 21
	a1.ID = 3
	a1.Name = "Attendee_1"
	a1.Age = 22
	a2.ID = 4
	a2.Name = "Attendee_2"
	a2.Age = 23
	a3.ID = 5
	a3.Name = "Attendee_3"
	a3.Age = 31

	var hostArray = []Person{h1}
	var attendeeArray1 = []Person{a1, a2}
	var attendeeArray2 = []Person{a3}

	var e1 Event
	e1.loc = p1Loc
	e1.hosts = hostArray
	e1.attendees = attendeeArray1
	var e2 Event
	e2.loc = p1Loc
	e2.hosts = hostArray
	e2.attendees = attendeeArray2

	eventDB.Create(e1)
	eventDB.Create(e2)
	/*
		db.Create(&Person{ID: 1, Name: "Golang w GORM Sqlite", Age: 20})
		db.Create(&Person{ID: 2, Name: "aj", Age: 20})
		db.Create(&Person{ID: 3, Name: "john", Age: 19})
		db.Create(&Person{ID: 4, Name: "Nick", Age: 21})
	*/

	// Read
	var p1 Person
	db.First(&p1) // should find person with integer primary key, but just gets first record

	fmt.Print(p1.Name)

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

func getEvents(db *gorm.DB) []Event {
	var p Person
	// Get all records
	result := db.Find(&p)
	// SELECT * FROM users;
	return result
}

func getEventsAroundLocation(db *gorm.DB, location Location, radius uint) []Event {
	var p Person
	result := db.Where("loc.x <= ? AND loc.y <= ?", radius, radius).Find(&p)
	return result
}

func getEventByID(db *gorm.DB, id uint) Event {
	var e Event
	// Get all records
	result := db.Find(&e, id)
	// SELECT * FROM users;
	return result
}

func createEvent(edb *gorm.DB, event Event) bool {
	edb.Create(event)
	return true
}

func editEvent(edb *gorm.DB, id int, event Event) bool {
	var e Event
	db.Model(&e).Find(id).Update("loc", event.loc)
	db.Model(&e).Find(id).Update("hosts", event.hosts)
	db.Model(&e).Find(id).Update("attendees", event.attendees)

	return true
}
