const AuthClient = require("../authclient/index.js");
const apiKey = require("../key/index.js");
const HistoricRates = require("../historicalrates/index.js");
const {
  setIntervalAsync,
  clearIntervalAsync,
} = require("set-interval-async/dynamic");

class Broker {
  constructor(crypAccount, fiatAccount, currencyPair) {
    this.crypAccount = crypAccount;
    this.fiatAccount = fiatAccount;
    this.currencyPair = currencyPair;
    this.range = [];
    this.historicRatesController = new HistoricRates();
  }

  async start(candleFreq, rangeLength) {
    //Connects to authorized CoinbasePro account
    const authCRYPAccount = await AuthClient.getAccount(this.crypAccount);
    const authFIATAccount = await AuthClient.getAccount(this.fiatAccount);

    await this.updateStrategy(candleFreq, rangeLength);
  }

  async updateStrategy(candleFrequency, rangeLength) {
    const prevPrices = await this.getPrevCandlePrices(
      this.currencyPair,
      rangeLength,
      candleFrequency
    );
    console.log(prevPrices[prevPrices.length - 1]);

    setIntervalAsync(async () => {
      const newPrice = await this.getNewCandlePrice(
        21600, //one 6 hour candle
        candleFrequency
      );
      console.log(newPrice);
      return newPrice;
    }, 1000 * 60 * 60 * 6);
  }

  async placeOrder(side, productId, price, size) {}

  async getPrevCandlePrices(curPair, rangeLength, frequency) {
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

  async getNewCandlePrice(oneCandle, frequency) {
    const newCandle = await this.historicRatesController.getHistoricRange(
      this.curPair,
      oneCandle, //one 6 hour candle
      frequency //size of candle
    );
    const newCandlePrice = newCandle[0][4];

    return newCandlePrice;
  }
}
module.exports = exports = Broker;
