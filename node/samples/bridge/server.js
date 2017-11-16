const Ssdp = require('node-ssdp')
const ip = require('ip')

const bridge = require('./bridge')
let ssdpServer

const httpServer = bridge.listen(function () {
  const addr = httpServer.address().address
  const port = httpServer.address().port
  console.log('👾 Bigfoot bridge started on %s:%s', addr, port)

  ssdpServer = new Ssdp.Server({
    suppressRootDeviceAdvertisements: true,
    location: `http://${ip.address()}:${port}`,
    sourcePort: 1900,
  })
  ssdpServer.addUSN('bigfoot:bridge')
  ssdpServer.start()
})

process.on('exit', function () {
  ssdpServer.stop() // advertise shutting down and stop listening
  httpServer.stop() // close express server
})
