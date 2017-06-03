var Server = require('node-ssdp').Server

server = new Server({
  suppressRootDeviceAdvertisements: true,
  location: 'here',
  sourcePort: 1900,
})

server.addUSN('bigfoot:all')

server.start()

process.on('exit', function() {
  server.stop() // advertise shutting down and stop listening
})
