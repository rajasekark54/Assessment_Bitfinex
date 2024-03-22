const { GrapeManager } = require("./config/grape");
const { PeerServer } = require("./service/PeerServerService");
const { PeerClient } = require("./service/PeerClientService");
const Link = require("grenache-nodejs-link");
const { requestData } = require("./data/requestData");

const link = new Link({
  grape: "http://127.0.0.1:30001",
});

const connectedLinks = new Link({
  grape: "http://127.0.0.1:30002",
});

const startGrape = async () => {
  console.log("Start peer node ...");
  const grapeManager = new GrapeManager(2);
  grapeManager.createGrapeInstance();
  await grapeManager.startAll();
  return grapeManager;
};

const initi = async () => {
  // start Grape
  const grapeManager = await startGrape();

  // server peer
  const peerServer = new PeerServer(link);
  await peerServer.start();

  //client peer
  const peerClient = new PeerClient(link);
  peerClient.start();

  // Parallel request execution
  let promises = [];
  for (const order of requestData) {
    promises.push(peerClient.request(order));
  }

  // wait for parallel execution
  await Promise.all(promises);

  // distribute data across all same network
  const treeLinkConnection = [connectedLinks.start()];
  peerServer.distributeToTreeNode(treeLinkConnection);

  peerClient.peer.stop();
  peerClient.link.stop();
  peerServer.link.stop();
  grapeManager.stopAll();
};

initi();
