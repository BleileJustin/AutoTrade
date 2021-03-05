const AuthClient = require("../authclient/index.js");
const apiKey = require("../key/index.js");

class Broker {
  constructor({ crypAccount, fiatAccount }) {
    this.crypAccount = crypAccount;
    this.fiatAccount = fiatAccount;
  }

  async start(crypAccount, fiatAccount) {
    //Connects to authorized CoinbasePro account
    const authCRYPAccount = await AuthClient.getAccount(crypAccount);
    const authFIATAccount = await AuthClient.getAccount(fiatAccount);
    const historicRatesController = new HistoricRates(curPair, rangeLength);
  }
  async placeOrder(side, productId, price, side) {}

  async getPreviousCandles(curPair, rangeLength, frequency) {
    const candles = await historicRatesController.getHistoricRange(
      curPair,
      rangeLength,
      frequency
    );
    return candles;
  }

  async getCurrentCandle(curPair, rangeLength, frequency) {}

  async getNewCandle() {}

  async updateStrategy() {}
}

module.exports = exports = Broker;
