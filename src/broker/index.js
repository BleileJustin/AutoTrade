const AuthClient = require("../authclient/index.js");
const apiKey = require("../key/index.js");
const HistoricRates = require("../historicalrates/index.js");

class Broker {
  constructor(crypAccount, fiatAccount, currencyPair) {
    this.crypAccount = crypAccount;
    this.fiatAccount = fiatAccount;
    this.currencyPair = currencyPair;
  }

  async start(candleFrequency, rangeLength) {
    //Connects to authorized CoinbasePro account
    const authCRYPAccount = await AuthClient.getAccount(this.crypAccount);
    const authFIATAccount = await AuthClient.getAccount(this.fiatAccount);

    const previousCandles = await this.getPreviousPrices(
      this.currencyPair,
      rangeLength,
      candleFrequency
    );
  }
  async placeOrder(side, productId, price, size) {}

  async getPreviousPrices(curPair, rangeLength, frequency) {
    const historicRatesController = new HistoricRates(curPair, rangeLength);
    const candles = await historicRatesController.getHistoricRange(
      curPair,
      rangeLength,
      frequency
    );
    let range = [];
    for (let i = 0; i < candles.length; i++) {
      range.unshift(candles[i][4]);
    }
    return range;
  }

  async getCurrentCandle(curPair, rangeLength, frequency) {}

  async getNewCandle() {}

  async updateStrategy() {}
}

module.exports = exports = Broker;
