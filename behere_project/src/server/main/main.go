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

func main() {
	var err error
	/* Database initialization */
	db, err = gorm.Open(sqlite.Open("src/server/internal/test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(Person{})

	// Create
	var p1Loc Location
	p1Loc.x = 50.0
	p1Loc.y = 100.0
	p1Loc.z = 50.0

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
