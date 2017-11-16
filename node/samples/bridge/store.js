
const createStore = require('redux-zero')

/**
* In memory state implementation of a database
* of connected devices. The purpose of this file
* is to mimick the actual behaviour of a hardware
* bridge that impersonates a series of devices
*/

let initialState = {
  bigfootBulbId: {
    id: 'bigfootBulbId',
    brand: 'Bigfoot',
    topic: 'Bulb',
    state: {
      power: 1,
      color: '#ffff00',
      brightness: 80,
      temperature: 50,
    },
  },
  bigfootPlugId: {
    id: 'bigfootPlugId',
    brand: 'Yeti',
    topic: 'Switch',
    state: {
      power: 0,
    },
  },
}

module.exports = createStore(initialState)
