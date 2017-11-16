
const request = require('supertest')
const chai = require('chai')

const bigfoot = require('../bigfoot')

chai.should()
const expect = chai.expect
const assert = chai.assert

describe('🐾  Bigfoot', function() {
  this.timeout(5000)

  it('should be able to use `hunt` as callback and promise', (done) => {
    const huntTimeout = 24
    const startTime = new Date()
    const thenable = bigfoot.hunt(() => {
      const elapsed = new Date() - startTime
      expect(thenable).to.be.a('promise')
      assert.approximately(elapsed, huntTimeout, 100)
      done()
    }, {duration: huntTimeout})
  })

  it('should discover a bigfoot instance', async () => {
    const instance = await bigfoot.alive({udn: 'unique-id'})
    const devices = await bigfoot.hunt({duration: 24})
    expect(devices['unique-id::bigfoot:all'].id).to.equal('unique-id::bigfoot:all')
    bigfoot.halt(instance)
  })

  it('should throw without bigfoot instance', async () => {
    const instance = await bigfoot.alive({udn: 'unique-id'})
    const devices = await bigfoot.hunt({duration: 24})
    const target = devices['unique-id::bigfoot:all']
    bigfoot.halt(instance)
    try {
      await bigfoot.poke(target)
      throw new Error('Should throw when device unreachable')
    } catch (err) {
      expect(err.code).to.equal('ECONNREFUSED')
    }
  })

  it('should poke an alive bigfoot instance', async () => {
    const instance = await bigfoot.alive({udn: 'unique-id'})
    const devices = await bigfoot.hunt({duration: 24})
    const target = devices['unique-id::bigfoot:all']
    const result = await bigfoot.poke(target)
    expect(result.reachable).to.equal(true)
    bigfoot.halt(instance)
  })
})

