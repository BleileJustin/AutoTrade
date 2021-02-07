const CoinbasePro = require("coinbase-pro");
const pubClient = new CoinbasePro.PublicClient();
const moment = require("moment");
class HistoricRates {
  constructor({ curPair }) {
    this.curPair = curPair;
  }
  async getHistoricRates(curPair) {
    const rates = await pubClient.getProductHistoricRates(curPair, {
      start: moment().subtract(21, "minutes").toDate(),
      end: moment().toDate(),

      granularity: 60,
    });
    if (rates != undefined) {
      /*for (let i = 0; i < rates.length; i++) {
        console.log(`
          Time:  ${rates[i][0]},
          Low:   ${rates[i][1]},
          High:  ${rates[i][2]},
          Open:  ${rates[i][3]},
          Close: ${rates[i][4]}
        `);
      }*/
      console.log(rates.length);
      return rates;
    }
  }
}

module.exports = exports = HistoricRates;
