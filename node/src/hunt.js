
const { Client } = require('node-ssdp')
const { capitalcase } = require('stringcase')

const manifest = require('../package.json')

const defaultOptions = {
  duration: 2500,
}

module.exports = (callback, options = defaultOptions) => {
  let devices = {}
  const opts = typeof callback === 'object'
    ? callback
    : options

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof callback === 'function') callback(devices)
      resolve(devices)
    }, opts.duration || 2500)

    const client = new Client()
    client.search('ssdp:all')
    client.on('response', (headers, statusCode, rinfo) => {
      const searchTarget = headers.ST

      if (!(searchTarget.match(/^bigfoot:/) || {}).input) {
        return // Do nothing
      }

      devices = {
        ...devices,
        [headers.USN]: parseResponse(headers, statusCode, rinfo),
      }
    })
  })
}

function parseResponse (headers, statusCode, rinfo) {
  const topic = headers.ST.split(':').pop()

  return {
    id: headers.USN,
    topic: capitalcase(topic.toLowerCase()),
    name: 'Bigfoot',
    brand: 'Bigfoot',
    state: {},
    meta: {
      rinfo,
      ...headers,
      bigfoot_version: manifest.version,
    },
  }
}
