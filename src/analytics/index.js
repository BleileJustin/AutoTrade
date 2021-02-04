//Dependencies
const CoinbasePro = require("coinbase-pro");
const moment = require("moment");
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

  getHistoricRates: async (curPair) => {
    const rates = await pubClient.getProductHistoricRates(curPair, {
      start: moment().subtract(1, "minutes").subtract(1, "s").toDate(),
      end: moment().subtract(1, "s").toDate(),

      granularity: 60,
    });
    return rates;
  },

  getHighSignal: async ({ bol, bolRange }) => {
    const highBand = bol.upper;
    console.log(highBand);
    console.log(bolRange);
    const highRange = bolRange.filter((price) => price > highBand);
    console.log(highRange);
    return highRange;
  },
};
