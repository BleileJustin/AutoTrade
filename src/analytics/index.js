//Dependencies
const CoinbasePro = require("coinbase-pro");
const pubClient = new CoinbasePro.PublicClient();
//Modules
const Price = require("../models/price.js");

//**TRADING CONTROLLER***
module.exports = {
  getPriceEntry: async (curPair) => {
    const tick = await pubClient.getProductTicker(curPair);
    const priceEntry = {
      base: "BTC",
      currency: "USD",
      bid: tick.bid,
      ask: tick.ask,
      spot: parseFloat(
        (tick.ask - tick.bid) / 2 + parseFloat(tick.bid)
      ).toFixed(2),
      time: Date(),
    };
    return priceEntry;
  },

  getProductTradeStream: async (curPair) => {
    const trades = pubClient.getProductTradeStream(curPair);
    console.log(trades);
  },

  getHighSignal: async ({ bol, bolRange }) => {
    const high = bol.upper;
    console.log(high);
    console.log(bolRange);
    const highRange = bolRange.filter((price) => price > high);
    console.log(highRange);
    return highRange;
  },

  getLowRange: async ({ bol, range }) => {
    const mid = bol[0].middle;
    const lowRange = range.filter((price) => {
      return price < mid;
    });
    return lowRange;
  },

  getHR: async (curPair) => {
    const rates = await pubClient.getProductHistoricRates(curPair);
    return rates;
  },
};
