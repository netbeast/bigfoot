
const request = require('supertest')
const chai = require('chai')

const store = require('./store')
const bridge = require('./bridge')

chai.should()
const expect = chai.expect

describe('bridge', function() {
  it('should return a hashmap with devices', done => {
    const devices = store.getState()

    request(bridge)
    .get('/')
    .expect('Content-Type', /json/)
    .expect(200, devices, done)
  })

  it('should return the state of the bulb', done => {
    const devices = store.getState()
    const firstDeviceKey = Object.keys(devices)[0]

    request(bridge)
    .get('/' + firstDeviceKey)
    .expect('Content-Type', /json/)
    .expect(200, devices[firstDeviceKey], done)
  })

  it('should modify the state of the plug', done => {
    const plug = store.getState().bigfootPlugId
    const nextPlug = {
      ...plug,
      state: {
        power: plug.state.power ? 0 : 1 //toggle its value
      }
    }

    request(bridge)
    .post('/' + plug.id)
    .send(nextPlug)
    .expect('Content-Type', /json/)
    .expect(200, nextPlug, done)
  })
})

