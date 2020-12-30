const CoinbasePro = require("coinbase-pro");
const Analytics = require("../analytics/index.js");
const Price = require("../models/price.js");
const websocket = new CoinbasePro.WebsocketClient(["BTC-USD"]);

const arr = [];

module.exports = {
  subscribe: async () => {
    websocket.subscribe({ product_ids: ["BTC-USD"], channels: ["heartbeat"] });
  },
  getData: async () => {
    websocket.on("message", (data) => {
      //if (data.type == "done" && data.reason == "filled")
      //console.log(`${data.changes[0][1]} ${data.changes[0][0]}`);
      //console.log(data);
      /*const mainLoop = async () => {
        const priceEntry = await Analytics.getPriceEntry("BTC-USD");
        const price = await Price.create(priceEntry);
      };
      mainLoop();*/
    });
    websocket.on("error", (err) => {
      /* handle error */
    });
    websocket.on("close", () => {
      /* ... */
    });
  },
};
