var Server = require('node-ssdp').Server

server = new Server({
  sourcePort: 1900,
  udn: 'my-unique-string-identidier', 
})

server.addUSN('bigfoot:all')

server.start()

process.on('exit', function() {
  server.stop() // advertise shutting down and stop listening
})
