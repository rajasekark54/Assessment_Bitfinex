const { PeerRPCClient } = require("grenache-nodejs-http");
const { CLIENT_REQUEST_TIMEOUT, SERVICE_NAME } = require("../utils/constant");

class PeerClient {
  constructor(link) {
    this.link = link;
    this.peer;
  }

  initPeer() {
    this.peer = new PeerRPCClient(this.link, {});
    this.peer.init();
  }

  start() {
    this.link.start();
    this.initPeer();
  }

  async request(payload) {
    console.log("Client: Request Initiated.");
    const timeout = { timeout: CLIENT_REQUEST_TIMEOUT };

    return new Promise((resolve, reject) => {
      this.peer.request(SERVICE_NAME, payload, timeout, (err, data) => {
        if (err) reject(err);
        console.log(data);
        console.log("Client: Request Done.");
        resolve(data);
      });
    });
  }
}

module.exports = {
  PeerClient,
};
