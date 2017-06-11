
const Ssdp = require('node-ssdp')
const express = require('express')
const app = express()

let state = { power: 0 }

app.get('/', function (req, res) {
  // Here you can return the switch state
  res.send(state)
})

app.post('/', function (req, res) {
  // Maybe perform some validation, change any device internal handling and then
  // return back the state
  state = req.state
  res.send(state)
})

const httpServer = app.listen(3000, function () {
  const addr = httpServer.address().address
  const port = httpServer.address().port
  console.log('👾 Bigfoot ping example started on %s:%s', addr, port)

  ssdpServer = new Ssdp.Server({
    suppressRootDeviceAdvertisements: true,
    location: `${addr}:${port}`,
    sourcePort: 1900,
  })
  ssdpServer.addUSN('bigfoot:switch')
  ssdpServer.start()
})

process.on('exit', function() {
  ssdpServer.stop() // advertise shutting down and stop listening
  app.stop() // close express server
})
