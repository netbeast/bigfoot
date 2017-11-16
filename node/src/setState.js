
const axios = require('axios')

module.exports = (device, params) => {
  return axios
    .post(device.meta.LOCATION + '/state', params)
    .then(res => res.data.state)
}
