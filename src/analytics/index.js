//Dependencies
const CoinbasePro = require("coinbase-pro");
const moment = require("moment");
const pubClient = new CoinbasePro.PublicClient();

//**TRADING CONTROLLER***
module.exports = {
  getTick: async (curpair) => {
    const t = await pubClient.getProductTicker(curPair);
    return t;
  },

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
      start: moment().subtract(21, "minutes").toDate(),
      end: moment().toDate(),

      granularity: 60,
    });
    if (rates != undefined) {
      console.log(`
      Time:  ${rates[0][0]},
      Low:   ${rates[0][1]},
      High:  ${rates[0][2]},
      Open:  ${rates[0][3]},
      Close: ${rates[0][4]}
      `);
      return rates;
    }
  },

  testBBPercentage: async (bolbands) => {},
};
