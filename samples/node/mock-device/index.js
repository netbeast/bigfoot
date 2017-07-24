
const Ssdp = require('node-ssdp')
const express = require('express')
var bodyParser = require('body-parser')
const ip = require('ip')
const app = express()

let state = {
  power: 1,
  color: '#ffff00',
  brightness: 80,
  temperature: 50,
}

app.use(bodyParser.json())

app.get('/', function (req, res) {
  // Here you can return the switch state
  console.log('\n State requested:')
  console.log(state)
  res.json(state)
})

app.post('/', function (req, res) {
  // Maybe perform some validation, change any device internal handling and then
  // return back the state
  state = req.body.state || state
  console.log('\n State changed:')
  console.log(state)
  res.json(state)
})

const httpServer = app.listen(3000, function () {
  const addr = httpServer.address().address
  const port = httpServer.address().port
  console.log('👾 Bigfoot device mock started on %s:%s', addr, port)

  ssdpServer = new Ssdp.Server({
    suppressRootDeviceAdvertisements: true,
    location: `http://${ip.address()}:${port}`,
    sourcePort: 1900,
  })
  ssdpServer.addUSN('bigfoot:bulb')
  ssdpServer.start()
})

process.on('exit', function() {
  ssdpServer.stop() // advertise shutting down and stop listening
  app.stop() // close express server
})
