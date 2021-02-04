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

  getHR: async (curPair) => {
    const rates = await pubClient.getProductHistoricRates(curPair, {
      start: moment().subtract(1, "minutes").toDate(),
      end: moment().toDate(),

      granularity: 60,
    });

    console.log(`
      Low:   ${rates[0][1]},
      High:  ${rates[0][2]},
      Open:  ${rates[0][3]},
      Close: ${rates[0][4]}
      `);
    return rates;
  },

  getLR: async (curPair) => {},

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
};
