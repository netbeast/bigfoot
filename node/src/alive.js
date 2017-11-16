// node/samples/mock-device
const createStore = require('redux-zero')
const Ssdp = require('node-ssdp')
const express = require('express')
const bodyParser = require('body-parser')
const ip = require('ip')

module.exports = (options) => {
  const {udn, topic = 'all'} = options

  return new Promise((resolve, reject) => {
    const api = express()
    const store = createStore()
    const dummyGetter = commit => commit(store.getState())
    const dummySetter = (params, commit) => commit(store.setState(params))

    const getHandler = options.getHandler || dummyGetter
    const setHandler = options.setHandler || dummySetter

    api.use(bodyParser.json())
    api.get('/', (req, res) => {
      getHandler(commitedState => {
        store.setState(commitedState)
        res.json(commitedState)
      })
    })
    api.post('/', (req, res) => {
      setHandler(req.body, commitedState => {
        store.setState(commitedState)
        res.json(commitedState)
      })
    })

    const httpServer = api.listen(function () {
      const port = httpServer.address().port
      const ssdpServer = new Ssdp.Server({
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

      return resolve({
        api,
        httpServer,
        ssdpServer,
        udn,
        topic,
      })
    })
  })
}
