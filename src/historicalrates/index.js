const CoinbasePro = require("coinbase-pro");
const pubClient = new CoinbasePro.PublicClient();
const moment = require("moment");

//HISTORIC RATES

class HistoricRates {
  constructor({ curPair, rangeLength }) {
    this.curPair = curPair;
    this.rangeLength = rangeLength;
  }
  //Accesses historical candlestick data from CoinbasePro API from a certain rangeLength
  async getHistoricRange(curPair, rangeLength, frequency) {
    const rates = await pubClient.getProductHistoricRates(curPair, {
      start: moment().subtract(rangeLength, "minutes").toDate(),
      end: moment().toDate(),
      granularity: frequency,
    });
    if (rates != undefined) {
      return rates;
    }
  }
}

module.exports = exports = HistoricRates;
