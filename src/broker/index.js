const AuthClient = require("../authclient/index.js");
const HistoricRates = require("../historicalrates/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const apiKey = require("../key/index.js");

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
        candleFrequency, //one 6 hour candle
        candleFrequency
      );
      this.range.push(newPrice); //adds latest price to array
      this.range.shift(); //removes oldest price from array

      //Strategy Update Controller
      const bollingerBands = await BollingerBands.getBollingerBands(
        this.range,
        20
      );

      //Checks latest price update for signal
      if (bollingerBands[bollingerBands.length - 1].pb > 1.0) {
        // Runs if a BB sell signal
        //this.onSellSignal();
        console.log(`Sell`);
      } else if (bollingerBands[bollingerBands.length - 1].pb < 0) {
        // Runs if a BB buy signal
        //this.onBuySignal();
        console.log(`Buy`);
      }

      console.log(newPrice);
      console.log(this.range);
      console.log(bollingerBands[bollingerBands.length - 1]);
    }, 1000 * candleFrequency);
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
      this.currencyPair,
      oneCandle, //one 6 hour candle
      frequency //size of candle
    );
    const newCandlePrice = newCandle[0][4];

    return newCandlePrice;
  }
}
module.exports = exports = Broker;
