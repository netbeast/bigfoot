
const { Client } = require('node-ssdp')
const { capitalcase } = require('stringcase')

const defaultOptions = {
  duration: 2500,
}

module.exports = (callback, options = defaultOptions) => {
  let devices = {}
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (callback) callback(devices)
      resolve(devices)
    }, options.duration)

    client = new Client()
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
    isCloud: false,
    reachable: true,
    _state: {},
    _device: {
      rinfo,
      ...headers,
    },
  }
}
