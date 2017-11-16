/* global describe, it */
const chai = require('chai')

const bigfoot = require('../bigfoot')

chai.should()
const expect = chai.expect
const assert = chai.assert

describe('🐾  Bigfoot', function () {
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
    const instance = await bigfoot.alive({id: 'unique-id'})
    const devices = await bigfoot.hunt({duration: 24})
    expect(devices['unique-id::bigfoot:all'].id).to.equal('unique-id::bigfoot:all')
    bigfoot.halt(instance)
  })

  it('should throw without bigfoot instance', async () => {
    const instance = await bigfoot.alive({id: 'unique-id'})
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
    const instance = await bigfoot.alive({id: 'unique-id'})
    const devices = await bigfoot.hunt({duration: 24})
    const target = devices['unique-id::bigfoot:all']
    const result = await bigfoot.poke(target)
    expect(result.reachable).to.equal(true)
    bigfoot.halt(instance)
  })

  it('should enable a dummy device, without listeners', async () => {
    const instance = await bigfoot.alive({id: 'unique-id'})
    const devices = await bigfoot.hunt({duration: 24})
    const target = devices['unique-id::bigfoot:all']
    const nextState = { active: true }
    await bigfoot.setState(target, nextState)
    const result = await bigfoot.getState(target)
    expect(result).to.deep.equal(nextState)

    // Add another state change
    await bigfoot.setState(target, { param: 'another' })
    const result2nd = await bigfoot.getState(target)
    expect(result2nd).to.deep.equal({...nextState, param: 'another'})
    bigfoot.halt(instance)
  })

  it('should handle requests', (done) => {
    let instance
    bigfoot.alive({id: 'unique-id'}, (commit, params) => {
      expect(params).to.equal(undefined)
      expect(commit).to.be.a('function')
      // We need to finish the request so the socket closes
      commit()
      done()
      bigfoot.halt(instance)
    }).then(bfoot => {
      instance = bfoot
      return bigfoot.hunt({id: 'unique-id::bigfoot:all', duration: 24})
    }).then(device => bigfoot.getState(device))
      .catch(done)
  })

  it('should handle state changes', async () => {
    let innerState = {}
    const instance = await bigfoot.alive({id: 'unique-id'}, (commit, params) => {
      innerState = { ...innerState, ...params }
      commit(innerState)
    })

    const nextState = {power: 0, color: '#ff00ee'}
    const device = await bigfoot.hunt({id: 'unique-id::bigfoot:all', duration: 24})
    await bigfoot.setState(device, nextState)
    const result = await bigfoot.getState(device)
    expect(result).to.deep.equal(nextState)
    bigfoot.halt(instance)
  })
})
