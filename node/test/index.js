
const request = require('supertest')
const chai = require('chai')

const bigfoot = require('../bigfoot')

chai.should()
const expect = chai.expect

describe('bridge', function() {
  this.timeout(5000)
  it('should discover a bigfoot instance', async () => {
    const instance = await bigfoot.alive({udn: 'unique-id'})
    const devices = await bigfoot.hunt()
    expect(devices['unique-id::bigfoot:all'].id).to.equal('unique-id::bigfoot:all')
    bigfoot.halt(instance)
  })
})

