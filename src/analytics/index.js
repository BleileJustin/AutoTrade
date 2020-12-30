//Dependencies
const CoinbasePro = require("coinbase-pro");
const pubClient = new CoinbasePro.PublicClient();
//Modules
const Price = require("../models/price.js");

//**TRADING CONTROLLER***
module.exports = {
  getPriceEntry: async curPair => {
    const tick = await pubClient.getProductTicker(curPair);
    const priceEntry = {
      base: "BTC",
      currency: "USD",
      bid: tick.bid,
      ask: tick.ask,
      spot: parseFloat(
        (tick.ask - tick.bid) / 2 + parseFloat(tick.bid)
      ).toFixed(2),
      time: Date()
    };
    return priceEntry;
  },

  getHighRange: async ({ bol, range }) => {
    const mid = bol[0].middle;

    const highRange = range.filter(price => {
      return price > mid;
    });
    return highRange;
  },

  getLowRange: async ({ bol, range }) => {
    const mid = bol[0].middle;
    const lowRange = range.filter(price => {
      return price < mid;
    });
    return lowRange;
  },

  getHR: async curPair => {
    const rates = await pubClient.getProductHistoricRates(curPair);
    return rates;
  }
};
