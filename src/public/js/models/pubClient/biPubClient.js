const apiKey = require("../key/index.js");
const Binance = require("node-binance-api");
const moment = require("moment");

const key = apiKey.get("BINANCE_API_KEY");
const secret = apiKey.get("BINANCE_API_SECRET");

const binance = new Binance().options({
  APIKEY: key,
  APISECRET: secret,
});

//HISTORIC RATES
class HistoricRates {
  constructor() {}
  //Accesses historical candlestick data from CoinbasePro API from a certain rangeLength

  async getHistoricRange(curPair, rangeLength, frequency, periodsBack) {
    const range = (rangeLength * periodsBack) / 60;

    let rates = await binance.candlesticks(curPair, frequency);
    rates = rates.slice(Math.max(rates.length - range, 0));
    rates = rates.map(function (x) {
      return parseFloat(x[4]);
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
/*
{
  start: moment()
    .subtract(rangeLength * periodsBack, "minutes")
    .toDate(),
  end: moment()
    .subtract(rangeLength * (periodsBack - 1), "minutes")
    .toDate(),
}
*/