const apiKey = require("../key/index.js");
const Binance = require("node-binance-api");

const key = apiKey.get("BINANCE_API_KEY");
const secret = apiKey.get("BINANCE_API_SECRET");
const binance = new Binance().options({
  APIKEY: key,
  APISECRET: secret,
});

class BiAuthClient {
  constructor() {}

  placeOrder = async (params) => {};
  getAvailable = async (id) => {
    let available = "";
    const balances = await binance.balance();

    switch (id) {
      case "USD":
        available = balances.USD.available;
        break;
      case "VET":
        available = balances.VET.available;
        break;
      case "UNI":
        available = balances.UNI.available;
        break;
      case "OXT":
        available = balances.OXT.available;
        break;
    }
    return available;
  };
}

module.exports = exports = BiAuthClient;
