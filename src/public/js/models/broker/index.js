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
  constructor(interval) {
    this.authClient;
    this.updatingStrategy = false;
    this.range = [];
    this.historicRatesController;
    this.interval = interval;
  }

  async start(
    curPair,
    candleFreq,
    rangeLength,
    crypAccount,
    fiatAccount,
    strategy,
    exchange
  ) {
    //Connects to authorized CoinbasePro account
    //const accounts = await AuthClient.getAccounts();
    this.updatingStrategy = true;
    console.log("Trading Started");
    console.log("Updating Strategy: " + this.updatingStrategy);

    const authClient = await this.setExchange(exchange);
    await this.updateStrategy(
      curPair,
      candleFreq,
      rangeLength,
      crypAccount,
      fiatAccount,
      strategy,
      exchange
    );
    //TEST
    //let balance = await this.authClient.getBalance();
    //console.log(balance);
  }
  stop = () => {
    this.updatingStrategy = false;
    console.log("Trading Stopped");
    console.log("Updating Strategy: " + this.updatingStrategy);
  };

  async setExchange(exchange) {
    if (exchange == "CoinbasePro") {
      this.authClient = new CBAuthClient();
      this.historicRatesController = new CBPubClient();
    } else if (exchange == "Binance") {
      this.authClient = new BiAuthClient();
      this.historicRatesController = new BiPubClient();
    }
  }

  async updateStrategy(
    curPair,
    candleFrequency,
    rangeLength,
    crypAccount,
    fiatAccount,
    strategy,
    exchange
  ) {
    const prevPrices = await this.getPrevCandlePrices(
      curPair,
      rangeLength,
      candleFrequency,
      exchange
    );

    const authClient = await this.setExchange(exchange);

    const interval = setIntervalAsync(async () => {
      if (this.updatingStrategy === false) {
        clearIntervalAsync(interval);
        console.log("Interval Shutdown");
      }
      console.log(moment().toDate());
      const newPrice = await this.getNewClosePrice(
        candleFrequency, //one 6 hour candle
        candleFrequency,
        exchange,
        curPair
      );
      this.range.push(newPrice); //adds latest price to array
      this.range.shift(); //removes oldest price from array

      //Strategy Update Controller
      if (strategy == "BollingerBands") {
        const bollingerBands = await BollingerBands.getBollingerBands(
          this.range,
          20
        );

        const crypAccountBal = await this.authClient.getAvailable(crypAccount);
        const fiatAccountBal = await this.authClient.getAvailable(fiatAccount);
        //Checks latest price update for signal
        console.log(bollingerBands[bollingerBands.length - 1]);
        if (bollingerBands[bollingerBands.length - 1].pb > 1.0) {
          // Runs if a BB sell signal
          const sellPrice = await this.getCurrentPrice(curPair);
          const size = parseFloat(
            ((parseFloat(crypAccountBal) * 0.25) / sellPrice).toFixed(2)
          );
          this.onSellSignal(sellPrice.ask, size, curPair);
          console.log(`Sell`);
        } else if (bollingerBands[bollingerBands.length - 1].pb < 0) {
          // Runs if a BB buy signal
          const buyPrice = await this.getCurrentPrice(curPair);
          const size = parseFloat(
            ((parseFloat(fiatAccountBal) * 0.5) / buyPrice).toFixed(2)
          );
          this.onBuySignal(buyPrice.bid, size, curPair);
          console.log(`Buy`);
        }
      }
    }, 10 * this.interval);
  }

  onBuySignal = (price, size, curPair) => {
    this.placeOrder("buy", curPair, price, size, "hour");
  };

  onSellSignal = (price, size, curPair) => {
    this.placeOrder("sell", curPair, price, size, "hour");
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
  async getPrevCandlePrices(curPair, rangeLength, frequency, exchange) {
    const candles = await this.historicRatesController.getHistoricRange(
      curPair,
      rangeLength,
      frequency,
      1
    );
    if (exchange == "CoinbasePro") {
      for (let i = 0; i < candles.length; i++) {
        this.range.unshift(candles[i][4]);
      }
    } else if (exchange == "Binance") {
      for (let i = 0; i < candles.length; i++) {
        this.range.push(candles[i]);
      }
    }
    return this.range;
  }

  async getNewClosePrice(oneCandle, frequency, exchange, curPair) {
    let newCandle = "";
    let newClosePrice = "";
    if (exchange == "CoinbasePro") {
      newCandle = await this.historicRatesController.getHistoricRange(
        curPair,
        oneCandle, //one 6 hour candle
        frequency, //size of candle
        1
      );
      newClosePrice = newCandle[0][4];
    } else if (exchange == "Binance") {
      newClosePrice = await this.getCurrentPrice(curPair);
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
