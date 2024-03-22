const { Grape } = require("grenache-grape");
const {
  GRAPE_HOST,
  GRAPH_DHT_PORT,
  GRAPH_API_PORT,
} = require("../utils/constant");

class GrapeManager {
  constructor(noOfInstance) {
    this.noOfInstance = noOfInstance;
    this.grapeInstances = [];
  }

  onStart(err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("  grape: started");
  }

  onStop(err) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log("  grape: stopped");
  }

  createGrapeInstance() {
    for (let i = 0; i < this.noOfInstance; i++) {
      const option = {
        host: GRAPE_HOST,
        dht_port: GRAPH_DHT_PORT + i,
        dht_bootstrap: ["127.0.0.1:" + (GRAPH_DHT_PORT + ((i + 1) % 2))],
        api_port: GRAPH_API_PORT + i,
      };

      const instance = new Grape(option);
      this.grapeInstances.push(instance);
    }

    return this.grapeInstances;
  }

  async startAll() {
    let lastFrape = null;
    this.grapeInstances.forEach((instance) => {
      instance.start(this.onStart);
      const conf = instance.conf;
      const peer = `  grape --dp ${conf.dht_port} --aph ${conf.api_port} --bn ${conf.dht_bootstrap}`;
      console.log(peer);
      lastFrape = instance;
    });

    await new Promise((resolve, reject) => {
      lastFrape.on("ready", () => {
        resolve(true);
      });
    });
  }

  stopAll() {
    this.grapeInstances.forEach((instance) => {
      instance.on("ready", () => {
        instance.stop(this.onStop);
      });
    });
  }
}

module.exports = {
  GrapeManager,
};
