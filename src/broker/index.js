const AuthClient = require("../authclient/index.js");
const HistoricRates = require("../historicalrates/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const CoinbasePro = require("coinbase-pro");
const pubClient = new CoinbasePro.PublicClient();
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

    await this.updateStrategy(candleFreq, rangeLength);
  }

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

  async getNewClosePrice(oneCandle, frequency) {
    const newCandle = await this.historicRatesController.getHistoricRange(
      this.currencyPair,
      oneCandle, //one 6 hour candle
      frequency //size of candle
    );
    const newClosePrice = newCandle[0][4];

    return newClosePrice;
  }

  async getCurrentPrice() {
    const currentPrice = await pubClient.getProductTicker(this.currencyPair);
    return currentPrice;
  }

  async updateStrategy(candleFrequency, rangeLength) {
    const prevPrices = await this.getPrevCandlePrices(
      this.currencyPair,
      rangeLength,
      candleFrequency
    );
    console.log(prevPrices[prevPrices.length - 1]);

    setIntervalAsync(async () => {
      const newPrice = await this.getNewClosePrice(
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
        const sellPrice = await this.getCurrentPrice();
        this.onSellSignal(
          sellPrice.ask,
          parseFloat(this.crypAccount.balance) * 0.5
        );
        console.log(`Sell`);
      } else if (bollingerBands[bollingerBands.length - 1].pb < 0) {
        // Runs if a BB buy signal
        const buyPrice = await this.getCurrentPrice();
        this.onBuySignal(
          buyPrice.bid,
          parseFloat(this.fiatAccount.balance) * 0.5
        );
        console.log(`Buy`);
      }
    }, 1000 * candleFrequency);
  }

  onBuySignal = (price, size) => {
    this.placeOrder("buy", this.currencyPair, price, size, 60);
  };

  onSellSignal = (price, size) => {
    this.placeOrder("sell", this.currencyPair, price, size, 60);
  };

  async placeOrder(side, productId, price, size, cancelAfter) {
    const params = {
      side: side,
      product_id: productId,
      price: price,
      size: size,
      cancel_after: cancelAfter,
    };
    //AuthClient.placeOrder(params)
  }
}
module.exports = exports = Broker;
