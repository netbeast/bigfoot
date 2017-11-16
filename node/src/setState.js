
const axios = require('axios')

module.exports = (device, params) => {
  return axios
    .post(device.meta.LOCATION, {
      ...device,
      state: {
        ...device.state,
        ...params,
      },
    })
    .then(res => res.data.state)
}
