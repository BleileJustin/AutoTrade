const CoinbasePro = require("coinbase-pro");
const Analytics = require("../analytics/index.js");
const Price = require("../models/price.js");
const websocket = new CoinbasePro.WebsocketClient(["BTC-USD"]);

const arr = [];
let i = 0;

module.exports = {
  subscribe: async () => {
    websocket.subscribe({ product_ids: ["BTC-USD"], channels: ["ticker"] });
  },
  getData: async () => {
    websocket.on("message", (data) => {
      if (data.type == "ticker") {
        i++;
        console.log(i);
        const price = data.price;
        console.log(data);
        return data;
      }
    });
    websocket.on("error", (err) => {
      /* handle error */
    });
    websocket.on("close", () => {
      /* ... */
    });
  },
};
