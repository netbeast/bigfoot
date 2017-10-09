package main

import (
  "log"
  "github.com/fromkeith/gossdp"
)

func main() {
  log.Println("Go, bigfoot!\n")

  s, err := gossdp.NewSsdp(nil)
  
  if err != nil {
    log.Println("Error creating ssdp server: ", err)
    return
  }
  
  // Define the service we want to advertise
  serverDef := gossdp.AdvertisableServer{
    ServiceType: "bigfoot:all", // define the service type
    DeviceUuid: "hh0c2981-0029-44b7-4u04-27f187aecf78", // make this unique!
    Location: "http://192.168.1.1:8080", // this is the location of the service we are advertising
    MaxAge: 3600, // Max age this advertisment is valid for
  }

  // Call stop  when we are done
  defer s.Stop()

  // run! this will block until stop is called. so open it in a goroutine here
  go s.Start()

  // start advertising it!
  s.AdvertiseServer(serverDef)
}
