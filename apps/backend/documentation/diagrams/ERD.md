```mermaid
erDiagram

  "addresses" {
    String id "🗝️"
    String latitude 
    String longitude 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "schools" {
    String id "🗝️"
    String name 
    DateTime morning_arrival 
    DateTime morning_departure 
    DateTime afternoon_arrival 
    DateTime afternoon_departure 
    DateTime night_arrival 
    DateTime night_departure 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "users" {
    String id "🗝️"
    String code 
    String name 
    String email 
    String cellphone 
    String type 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "roles" {
    String id "🗝️"
    String name 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "responsibles" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    }
  

  "students" {
    String id "🗝️"
    Boolean goes 
    Boolean return 
    Boolean morning 
    Boolean afternoon 
    Boolean night 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "drivers" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    }
  

  "itineraries" {
    String id "🗝️"
    Boolean monday 
    Boolean tuesday 
    Boolean wednesday 
    Boolean thursday 
    Boolean friday 
    Boolean saturday 
    Boolean morning 
    Boolean afternoon 
    Boolean night 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "student_itineraries" {
    DateTime created_at 
    DateTime updated_at 
    }
  

  "trips" {
    String id "🗝️"
    Json path 
    DateTime started_at 
    DateTime finished_at 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "student_trips" {
    String id "🗝️"
    DateTime embarked_at 
    DateTime disembarked_at 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "routes" {
    String id "🗝️"
    String name 
    String source_name 
    Float source_lat 
    Float source_lon 
    String dest_name 
    Float dest_lat 
    Float dest_lon 
    Float distance 
    Float duration 
    DateTime created_at 
    DateTime updated_at 
    }
  
    "addresses" o{--}o "students" : "student"
    "addresses" o{--}o "schools" : "school"
    "schools" o|--|| "addresses" : "adress"
    "schools" o|--|| "itineraries" : "itinerary"
    "schools" o{--}o "students" : "student"
    "users" o|--|| "roles" : "role"
    "users" o|--|| "drivers" : "driver"
    "users" o|--|| "responsibles" : "responsible"
    "roles" o{--}o "users" : "user"
    "responsibles" o{--}o "users" : "user"
    "students" o|--|| "schools" : "school"
    "students" o|--|| "addresses" : "adress"
    "students" o{--}o "student_trips" : "student_trip"
    "students" o{--}o "student_itineraries" : "student_itinerary"
    "drivers" o{--}o "users" : "user"
    "drivers" o|--|| "itineraries" : "itinerary"
    "itineraries" o{--}o "drivers" : "driver"
    "itineraries" o{--}o "schools" : "school"
    "itineraries" o{--}o "trips" : "trip"
    "itineraries" o{--}o "student_itineraries" : "student_Itinerary"
    "student_itineraries" o|--|| "students" : "student"
    "student_itineraries" o|--|| "itineraries" : "itinerary"
    "trips" o|--|o "itineraries" : "Itinerary"
    "trips" o{--}o "student_trips" : "student_trip"
    "student_trips" o|--|| "students" : "student"
    "student_trips" o|--|| "trips" : "trip"
```
