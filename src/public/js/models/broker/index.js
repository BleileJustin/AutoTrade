const CBAuthClient = require("../authclient/cbAuthClient.js");
const CBPubClient = require("../pubClient/cbPubClient.js");
const BiAuthClient = require("../authclient/biAuthClient.js");
const BiPubClient = require("../pubClient/biPubClient.js");

const BollingerBands = require("../strategies/bollingerbands.js");
const moment = require("moment");

const {
  setIntervalAsync,
  clearIntervalAsync,
} = require("set-interval-async/dynamic");

class Broker {
  constructor(
    crypAccount,
    fiatAccount,
    currencyPair,
    strategy,
    exchange,
    interval
  ) {
    this.crypAccount = crypAccount;
    this.fiatAccount = fiatAccount;
    this.strategy = strategy;
    this.exchange = exchange;
    this.authClient;
    this.currencyPair = currencyPair;
    this.updatingStrategy = false;
    this.range = [];
    this.historicRatesController;
    this.interval = interval;
  }

  async start(candleFreq, rangeLength) {
    //Connects to authorized CoinbasePro account
    //const accounts = await AuthClient.getAccounts();
    this.updatingStrategy = true;
    console.log("Trading Started");
    console.log("Updating Strategy: " + this.updatingStrategy);

    const authClient = await this.setExchange();
    await this.updateStrategy(candleFreq, rangeLength);
    //TEST
  }
  stop = () => {
    this.updatingStrategy = false;
    console.log("Trading Stopped");
    console.log("Updating Strategy: " + this.updatingStrategy);
  };

  async setExchange() {
    if (this.exchange == "CoinbasePro") {
      this.authClient = new CBAuthClient();
      this.historicRatesController = new CBPubClient();
    } else if (this.exchange == "Binance") {
      this.authClient = new BiAuthClient();
      this.historicRatesController = new BiPubClient();
    }
  }

  async updateStrategy(candleFrequency, rangeLength) {
    const prevPrices = await this.getPrevCandlePrices(
      this.currencyPair,
      rangeLength,
      candleFrequency
    );

    const authClient = await this.setExchange();

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

      //Strategy Update Controller
      if (this.strategy == "BollingerBands") {
        const bollingerBands = await BollingerBands.getBollingerBands(
          this.range,
          20
        );

        const crypAccountBal = await this.authClient.getAvailable(
          this.crypAccount
        );
        const fiatAccountBal = await this.authClient.getAvailable(
          this.fiatAccount
        );
        //Checks latest price update for signal
        console.log(bollingerBands[bollingerBands.length - 1]);
        if (bollingerBands[bollingerBands.length - 1].pb > 1.0) {
          // Runs if a BB sell signal
          const sellPrice = await this.getCurrentPrice(this.currencyPair);
          const size = parseFloat(
            ((parseFloat(crypAccountBal) * 0.25) / sellPrice).toFixed(2)
          );
          this.onSellSignal(sellPrice.ask, size);
          console.log(`Sell`);
        } else if (bollingerBands[bollingerBands.length - 1].pb < 0) {
          // Runs if a BB buy signal
          const buyPrice = await this.getCurrentPrice(this.currencyPair);
          const size = parseFloat(
            ((parseFloat(fiatAccountBal) * 0.5) / buyPrice).toFixed(2)
          );
          this.onBuySignal(buyPrice.bid, size);
          console.log(`Buy`);
        }
      }
    }, 10 * this.interval);
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
    const order = await this.authClient.placeOrder(params);
    console.log(order);
    console.log("Order Placed");
  }

  //Public Client Access
  async getPrevCandlePrices(curPair, rangeLength, frequency) {
    const candles = await this.historicRatesController.getHistoricRange(
      this.currencyPair,
      rangeLength,
      frequency,
      1
    );
    if (this.exchange == "CoinbasePro") {
      for (let i = 0; i < candles.length; i++) {
        this.range.unshift(candles[i][4]);
      }
    } else if (this.exchange == "Binance") {
      for (let i = 0; i < candles.length; i++) {
        this.range.push(candles[i]);
      }
    }
    return this.range;
  }

  async getNewClosePrice(oneCandle, frequency) {
    let newCandle = "";
    let newClosePrice = "";
    if (this.exchange == "CoinbasePro") {
      newCandle = await this.historicRatesController.getHistoricRange(
        this.currencyPair,
        oneCandle, //one 6 hour candle
        frequency, //size of candle
        1
      );
      newClosePrice = newCandle[0][4];
    } else if (this.exchange == "Binance") {
      newClosePrice = await this.getCurrentPrice(this.currencyPair);
    }

    return newClosePrice;
  }

  async getCurrentPrice(curPair) {
    const currentPrice = await this.historicRatesController.getCurrentPrice(
      curPair
    );
    return currentPrice;
  }
}
module.exports = exports = Broker;
