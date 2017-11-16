// node/samples/mock-device
const createStore = require('redux-zero')
const Ssdp = require('node-ssdp')
const express = require('express')
const bodyParser = require('body-parser')
const ip = require('ip')

module.exports = (options, handler) => {
  const {id, topic = 'all'} = options

  return new Promise((resolve, reject) => {
    const api = express()
    const store = createStore()

    const dummyGetter = commit => commit(store.getState())
    const dummySetter = (commit, params) => {
      store.setState(params)
      commit(store.getState())
    }
    const getHandler = handler || dummyGetter
    const setHandler = handler || dummySetter

    api.use(bodyParser.json())
    api.get('/', (req, res) => {
      res.json({
        ...options,
        state: store.getState(),
      })
    })
    api.post('/', (req, res) => {
      setHandler(commitedState => {
        store.setState(commitedState)
        res.json(commitedState)
      }, req.body.state)
    })
    api.get('/state', (req, res) => {
      getHandler(commitedState => {
        store.setState(commitedState)
        res.json(commitedState)
      })
    })
    api.post('/state', (req, res) => {
      setHandler(commitedState => {
        store.setState(commitedState)
        res.json(commitedState)
      }, req.body)
    })

    const httpServer = api.listen(function () {
      const port = httpServer.address().port
      /**
      * With an SSDP handler, the unique device identifier
      * must be specified as UDN param
      */
      const ssdpServer = new Ssdp.Server({
        udn: id,
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
        ...options,
      })
    })
  })
}
