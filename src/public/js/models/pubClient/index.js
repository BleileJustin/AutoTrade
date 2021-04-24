const CoinbasePro = require("coinbase-pro");
const pubClient = new CoinbasePro.PublicClient();
const moment = require("moment");

//HISTORIC RATES
class HistoricRates {
  constructor() {}
  //Accesses historical candlestick data from CoinbasePro API from a certain rangeLength

  async getHistoricRange(curPair, rangeLength, frequency, periodsBack) {
    const rates = await pubClient.getProductHistoricRates(curPair, {
      start: moment()
        .subtract(rangeLength * periodsBack, "minutes")
        .toDate(),
      end: moment()
        .subtract(rangeLength * (periodsBack - 1), "minutes")
        .toDate(),
      granularity: frequency,
    });
    if (rates != undefined) {
      return rates;
    }
  }
  async getCurrentPrice(curPair) {
    const currentPrice = await pubClient.getProductTicker(curPair);
    return currentPrice;
  }
}

module.exports = exports = HistoricRates;