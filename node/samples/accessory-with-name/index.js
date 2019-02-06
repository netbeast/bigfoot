// node/samples/mock-device
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

let props = {
  name: 'Bedroom lamp'
}

app.use(bodyParser.json())

app.get('/', function (req, res) {
  console.log('\n State requested:')
  console.log(state)
  res.json(state)
})

app.post('/', function (req, res) {
  const incomingState = req.body || {}
  console.log('\n Incoming state')
  console.log(incomingState)
  state = {...state, ...incomingState}
  console.log('\n State changed:')
  console.log(state)
  res.json(state)
})

app.get('/accessory', (req, res) => {
  console.log('\n Accessory state and props requested:')
  const accessory = {...props, state}
  console.log(accessory)
  res.json(accessory)
})

app.get('/properties', (req, res) => {
  console.log('\n Properties requested:')
  console.log(props)
  res.json(props)
})

app.post('/properties', function (req, res) {
  console.log('\n Properties mutation requested:')
  const incomingProps = req.body || {}
  props = {...props, ...incomingProps}
  console.log(props)
  res.json(props)
})

const httpServer = app.listen(3000, function () {
  const addr = httpServer.address().address
  const port = httpServer.address().port
  console.log('👾 Bigfoot named accessory started on %s:%s', addr, port)

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
