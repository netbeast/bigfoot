// node/samples/webapp
const Ssdp = require('node-ssdp')
const express = require('express')
const ip = require('ip')
const app = express()

// Serve a web application to use as user interface or show data
app.use(express.static('public'))

const httpServer = app.listen(3000, function () {
  const addr = httpServer.address().address
  const port = httpServer.address().port
  console.log('👾 Bigfoot webapp example started on %s:%s', addr, port)

  ssdpServer = new Ssdp.Server({
    location: `http://${ip.address()}:${port}`,
    udn: 'Bigfoot_very-unique-bigfoot',
    sourcePort: 1900,
  })
  ssdpServer.addUSN('bigfoot:web')
  ssdpServer.start()
})

process.on('exit', function() {
  ssdpServer.stop() // advertise shutting down and stop listening
  app.stop() // close express server
})
