// node/samples/mock-device
const Ssdp = require('node-ssdp')
const express = require('express')
var bodyParser = require('body-parser')
const ip = require('ip')
const app = express()

let state = {
  power: 1,
  presence: false,
}

app.use(bodyParser.json())

app.get('/', function (req, res) {
  // Here you can return the switch state
  console.log('\n State requested:')
  console.log(state)
  res.json(state)
})

const httpServer = app.listen(3000, function () {
  const addr = httpServer.address().address
  const port = httpServer.address().port
  console.log('👾 Bigfoot sensor started on %s:%s', addr, port)

  ssdpServer = new Ssdp.Server({
    suppressRootDeviceAdvertisements: true,
    location: `http://${ip.address()}:${port}`,
    sourcePort: 1900,
  })
  ssdpServer.addUSN('bigfoot:sensor')
  ssdpServer.start()
})

process.on('exit', function() {
  ssdpServer.stop() // advertise shutting down and stop listening
  app.stop() // close express server
})
