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

  placeOrder = async (params) => {
    //side, productId, price, size, cancelAfter;
    const product = params.product_id;
    if (params.side == "buy") {
      console.log(product);
      binance.marketBuy(product, params.size);
    } else if (params.side == "sell") {
      binance.marketSell(product, params.size);
    }
  };
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
  getBalance = async () => {
    function balance_update(data) {
      console.log("Balance Update");
      for (let obj of data.B) {
        let { a: asset, f: available, l: onOrder } = obj;
        if (available == "0.00000000") continue;
        console.log(
          asset + "\tavailable: " + available + " (" + onOrder + " on order)"
        );
      }
    }

    const userData = await binance.websockets.userData(balance_update);
    return userData;
  };
}

module.exports = exports = BiAuthClient;
