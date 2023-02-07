package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"utils"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Location struct {
	x float32
	y float32
	z float32
}

type Person struct {
	name string
	age  int
	loc  Location
	// profile picture
	// friends
}

type Event struct {
	loc       Location
	hosts     []Person
	attendees []Person
}

func main() {
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

	log.Fatal(srv.ListenAndServe())
}

func helloWorld(w http.ResponseWriter, r *http.Request) {
	var data = struct {
		Title string `json:"title"`
	}{
		Title: "Golang Backend",
	}

	jsonBytes, err := utils.StructToJSON(data)
	if err != nil {
		fmt.Print(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBytes)
	return
}
