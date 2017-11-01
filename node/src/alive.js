// node/samples/mock-device
const Ssdp = require('node-ssdp')
const express = require('express')
const bodyParser = require('body-parser')
const ip = require('ip')

module.exports = ({udn, topic = 'all'}) => {
  return new Promise((resolve, reject) => {
    const app = express()
    app.use(bodyParser.json())

    const httpServer = app.listen(function () {
      const addr = httpServer.address().address
      const port = httpServer.address().port

      ssdpServer = new Ssdp.Server({
        udn,
        location: `http://${ip.address()}:${port}`,
        sourcePort: 1900,
      })

      ssdpServer.addUSN('bigfoot:' + topic)
      ssdpServer.start()

      process.on('exit', function () {
        ssdpServer.stop()
        httpServer.close()
      })

      return resolve({httpServer, ssdpServer})
    })
  })
}