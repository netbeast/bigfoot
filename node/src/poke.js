const axios = require('axios')

module.exports = (device) => {
  return axios
    .get(device.meta.LOCATION)
    .then(() => ({...device, reachable: true}))
}
