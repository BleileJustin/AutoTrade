const AuthClient = require("../authclient/index.js");
const apiKey = require("../key/index.js");
const HistoricRates = require("../historicalrates/index.js");

class Broker {
  constructor(crypAccount, fiatAccount, currencyPair) {
    this.crypAccount = crypAccount;
    this.fiatAccount = fiatAccount;
    this.currencyPair = currencyPair;
    this.range = [];
    this.historicRatesController = new HistoricRates();
  }

  async start(candleFrequency, rangeLength) {
    //Connects to authorized CoinbasePro account
    const authCRYPAccount = await AuthClient.getAccount(this.crypAccount);
    const authFIATAccount = await AuthClient.getAccount(this.fiatAccount);

    const previousPrices = await this.getPreviousCandlePrices(
      this.currencyPair,
      rangeLength,
      candleFrequency
    );
    console.log(previousPrices);
  }
  async placeOrder(side, productId, price, size) {}

  async getPreviousCandlePrices(curPair, rangeLength, frequency) {
    const candles = await this.historicRatesController.getHistoricRange(
      curPair,
      rangeLength,
      frequency
    );
    for (let i = 0; i < candles.length; i++) {
      this.range.unshift(candles[i][4]);
    }
    return this.range;
  }

  async getNewCandlePrice(curPair) {}

  async updateStrategy() {}
}

module.exports = exports = Broker;
