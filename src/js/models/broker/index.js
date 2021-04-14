const AuthClient = require("../authclient/index.js");
const HistoricRates = require("../pubClient/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const CoinbasePro = require("coinbase-pro");
const moment = require("moment");

const {
  setIntervalAsync,
  clearIntervalAsync,
} = require("set-interval-async/dynamic");

class Broker {
  constructor(crypAccount, fiatAccount, currencyPair) {
    this.crypAccount = crypAccount;
    this.fiatAccount = fiatAccount;
    this.currencyPair = currencyPair;
    this.updatingStrategy = false;
    this.range = [];
    this.historicRatesController = new HistoricRates();
  }

  async start(candleFreq, rangeLength) {
    //Connects to authorized CoinbasePro account
    this.updatingStrategy = true;
    console.log("Trading Started");
    console.log("Updating Strategy: " + this.updatingStrategy);
    await this.updateStrategy(candleFreq, rangeLength);
  }
  stop = () => {
    this.updatingStrategy = false;
    console.log("Trading Stopped");
    console.log("Updating Strategy: " + this.updatingStrategy);
  };

  async getPrevCandlePrices(curPair, rangeLength, frequency) {
    const candles = await this.historicRatesController.getHistoricRange(
      curPair,
      rangeLength,
      frequency,
      1
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
      frequency, //size of candle
      1
    );
    const newClosePrice = newCandle[0][4];

    return newClosePrice;
  }

  async getCurrentPrice() {
    const currentPrice = await this.historicRatesController.getCurrentPrice(
      this.currencyPair
    );
    return currentPrice;
  }

  async updateStrategy(candleFrequency, rangeLength) {
    const prevPrices = await this.getPrevCandlePrices(
      this.currencyPair,
      rangeLength,
      candleFrequency
    );
    console.log(prevPrices[prevPrices.length - 1]);
    const interval = setIntervalAsync(async () => {
      if (this.updatingStrategy === false) {
        clearIntervalAsync(interval);
        console.log("Interval Shutdown");
      }
      console.log(moment().toDate());
      const newPrice = await this.getNewClosePrice(
        candleFrequency, //one 6 hour candle
        candleFrequency
      );
      this.range.push(newPrice); //adds latest price to array
      this.range.shift(); //removes oldest price from array

      console.log(prevPrices[prevPrices.length - 1]);
      //Strategy Update Controller
      const bollingerBands = await BollingerBands.getBollingerBands(
        this.range,
        20
      );

      const crypAccountBal = await AuthClient.getAccount(this.crypAccount)
        .available;
      const fiatAccountBal = await AuthClient.getAccount(this.fiatAccount)
        .available;
      //Checks latest price update for signal
      console.log(bollingerBands[bollingerBands.length - 1]);
      if (bollingerBands[bollingerBands.length - 1].pb > 1.0) {
        // Runs if a BB sell signal
        const sellPrice = await this.getCurrentPrice();
        const size = parseFloat(
          ((parseFloat(crypAccountBal.available) * 0.25) / price.bid).toFixed(2)
        );
        this.onSellSignal(sellPrice.ask, size);
        console.log(`Sell`);
      } else if (bollingerBands[bollingerBands.length - 1].pb < 0) {
        // Runs if a BB buy signal
        const size = parseFloat(
          ((parseFloat(fiatAccountBal.available) * 0.5) / price.bid).toFixed(2)
        );
        const buyPrice = await this.getCurrentPrice();
        this.onBuySignal(buyPrice.bid, size);
        console.log(`Buy`);
      }
    }, 1000 * candleFrequency);
  }

  onBuySignal = (price, size) => {
    this.placeOrder("buy", this.currencyPair, price, size, "hour");
  };

  onSellSignal = (price, size) => {
    this.placeOrder("sell", this.currencyPair, price, size, "hour");
  };

  async placeOrder(side, productId, price, size, cancelAfter) {
    const params = {
      side: side,
      product_id: productId,
      price: price,
      size: size,
      time_in_force: "GTT",
      cancel_after: cancelAfter,
    };
    console.log(params);
    const order = await AuthClient.placeOrder(params);
    console.log(order);
    console.log("Order Placed");
  }
}
module.exports = exports = Broker;
