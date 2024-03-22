const { PeerRPCServer } = require("grenache-nodejs-http");
const { SREVER_TIMEOUT, SERVICE_NAME } = require("../utils/constant");
const _ = require("underscore");

class PeerServer {
  constructor(link, peerServer) {
    this.link = link;
    this.peer;
  }

  initPeer() {
    this.peer = new PeerRPCServer(this.link, {
      timeout: SREVER_TIMEOUT,
    });
    this.peer.init();
  }

  async start() {
    this.link.start();
    this.initPeer();

    this.service = this.peer.transport("server");
    this.service.listen(_.random(1000) + 1024);

    setInterval(() => {
      this.link.announce(SERVICE_NAME, this.service.port, {});
    }, 1000);
    this.requestHandler();

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  }

  saveData(data) {
    this.link.put({ v: data }, (err, hash) => {
      console.log("hash ---->", hash);
      console.log("Data saved to the DHT", hash);
      if (hash) {
        this.link.get(hash, (err, res) => {
          console.log("Data requested to the DHT", res);
        });
      }
    });
  }

  requestHandler() {
    this.service.on("request", (rid, key, payload, handler) => {
      console.log("Server: Request Received.");
      console.log(typeof payload, payload);
      this.saveData(payload);
      handler.reply(null, "Order Successfully Processed");
    });
  }

  distributeToTreeNode(treeNodeList) {
    for (const peerLink of treeNodeList) {
      const allSavedProp = this.link._reqs;

      for (const [key, value] of Object.entries(allSavedProp)) {
        console.log("Value: ====>", value);
        const data = JSON.parse(value.qhash);

        peerLink.put({ v: data }, (err, hash) => {
          console.log("Data saved to the connected Link DHT", hash);
          if (hash) {
            peerLink.get(hash, (err, res) => {
              console.log("Data requested to the DHT for cnnected node", res);
            });
          }
        });
      }
    }
  }
}

module.exports = {
  PeerServer,
};
