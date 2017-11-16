
const axios = require('axios')

module.exports = (device) => {
  return axios
    .get(device.meta.LOCATION + '/state')
    .then(res => res.data)
}
