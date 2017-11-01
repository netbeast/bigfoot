
module.exports = (bigfoot) => {
  const {httpServer, ssdpServer} = bigfoot
  ssdpServer.stop()
  httpServer.close()
}
