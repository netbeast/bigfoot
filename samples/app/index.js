
const Ssdp = require('node-ssdp')
const express = require('express')
const app = express()

// Serve a web application to use as user interface or show data
app.use(express.static('public'))

const httpServer = app.listen(3000, function () {
  const addr = httpServer.address().address
  const port = httpServer.address().port
  console.log('👾 Bigfoot ping example started on %s:%s', addr, port)

  ssdpServer = new Ssdp.Server({
    suppressRootDeviceAdvertisements: true,
    location: `${addr}:${port}`,
    sourcePort: 1900,
  })
  ssdpServer.addUSN('bigfoot:app')
  ssdpServer.start()
})

process.on('exit', function() {
  ssdpServer.stop() // advertise shutting down and stop listening
  app.stop() // close express server
})
