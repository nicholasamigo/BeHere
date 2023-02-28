struct Person - struct for a user's account representing them. It is an implementation of a gorm.Model that contains their name, and age.

```
type Person struct {
	gorm.Model
	Name string
	Age  uint
}
```
---
struct Event - gorm.Model struct representing an event containing it's name, the hostid it belongs to, latitude and longitude.

```
type Event struct {
	gorm.Model
	Name   string
	HostId uint
	Lat    float32
	Lng    float32
}
```
---
struct AttendRelation - gorm.Model struct that represents the relationship of a Person attending an event. 
This promotes data integrity by reducing duplicate data in the other tables.

```
type AttendRelation struct {
	gorm.Model
	PID uint
	EID uint
}
```
---
func helloWorld - Reference Function for RestFULLY interacting with frontend from backend
```
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
```
---
func getEventsAroundLocation - Function that returns the Events within a specified square radius around a location
Returns a list of Events
```
func getEventsAroundLocation(db *gorm.DB, Lat float32, Lng float32, radius float32) []Event {
	var result []Event

	eastBar := Lat + radius
	westBar := Lat - radius
	northBar := Lng + radius
	southBar := Lng - radius

	db.Where("lat >= ? AND lat <= ? AND lng >= ? AND lng <= ?", westBar, eastBar, southBar, northBar).Find(&result)

	return result
}
```
---
func getEventID - Function that returns the ID of a passed in event
```
func getEventID(db *gorm.DB, e Event) uint {
	var result Event
	db.Where("host_id = ? AND Name = ? AND Lat = ? AND Lng = ?", e.HostId, e.Name, e.Lat, e.Lng).Find(&result)

	return result.Model.ID
}
```
---
func getEventByID - Function that gets an Event by a given id
This id is the id within the database
```
func getEventByID(db *gorm.DB, id uint) Event {
	var result Event
  
	db.Find(&result, id)
  
	return result
}
```
---
func createEvent - Function that takes in a passed in event and creates it within the database
```
func createEvent(edb *gorm.DB, event Event) bool {
	edb.Create(&event)
	return true
}
```
---
func editEvent - Function that edits an event
Takes in an event id and replaces it with all the member attributes of a given event
```
func editEvent(edb *gorm.DB, id uint, event Event) bool {

	db.Model(&Event{}).Where("id = ?", id).Update("Name", event.Name)
	db.Model(&Event{}).Where("id = ?", id).Update("host_id", event.HostId)
	db.Model(&Event{}).Where("id = ?", id).Update("Lat", event.Lat)
	db.Model(&Event{}).Where("id = ?", id).Update("Lng", event.Lng)

	return true
}
```
