/**
* node/samples/bridge
*/

const express = require('express')
const bodyParser = require('body-parser')

const store = require('./store')

const app = module.exports = express()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json(store.getState())
})

app.get('/:device_id', function (req, res) {
  const state = store.getState()
  res.json(state[req.params.device_id])
})

app.post('/:device_id', function (req, res) {
  if (!req.params.device_id) {
    res.status(404).send("No device available")
  }

  store.setState({ [req.params.device_id]: req.body })
  res.json(store.getState()[req.params.device_id])
})

