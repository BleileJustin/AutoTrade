const CoinbasePro = require("coinbase-pro");
const pubClient = new CoinbasePro.PublicClient();
const moment = require("moment");
class HistoricRates {
  constructor({ curPair, rangeLength }) {
    this.curPair = curPair;
    this.rangeLength = rangeLength;
  }
  async getHistoricRange(curPair, rangeLength) {
    const rates = await pubClient.getProductHistoricRates(curPair, {
      start: moment().subtract(rangeLength, "minutes").toDate(),
      end: moment().toDate(),

      granularity: 60,
    });
    if (rates != undefined) {
      return rates;
    }
  }
}

module.exports = exports = HistoricRates;
