const apiKey = require("../key/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const HistoricRates = require("../historicalrates/index.js");

//BACKTESTER

class Backtest {
  constructor({ curPair, rangeLength }) {
    this.curPair = curPair;
    this.rangeLength = rangeLength;
    this.positionBTC = 5000;
    this.positionUSD = 10000;
    this.currentTradePrice;
    this.previousTradePrice;
  }
  trade = (counter, fullCandlesticks, type) => {
    const candleId = counter + 19; //Candle id that is = to BB id
    const candleClose = fullCandlesticks[candleId][4];
    const tradeAmt = candleClose * 0.03;
    this.previousTradePrice = this.currentTradePrice;
    this.currentTradePrice = parseInt(candleClose);
    if (this.previousTradePrice) {
      const relativeChange =
        (this.currentTradePrice - this.previousTradePrice) /
        this.previousTradePrice;
      this.positionBTC += this.positionBTC * relativeChange;
    }

    if (type === "Buy" && this.positionUSD > tradeAmt) {
      this.positionUSD -= tradeAmt;
      this.positionBTC += tradeAmt;
      console.log(`
${type}
Trade Amount: $${tradeAmt}`);
    } else if (type === "Sell" && this.positionBTC > tradeAmt) {
      this.positionUSD += tradeAmt;
      this.positionBTC -= tradeAmt;
      console.log(`
${type}
Trade Amount: $${tradeAmt}`);
    } else if (type == "close") {
      this.positionUSD += this.positionBTC;
      this.positionBTC = 0;
    } else {
      console.log("");
      console.log("Trade FAILED");
    }
  };
  //Gets set of full candle data within the rangeLength
  async getFullCandles(curPair, rangeLength, frequency) {
    const historicRatesController = new HistoricRates(curPair, rangeLength);
    const candles = await historicRatesController.getHistoricRange(
      curPair,
      rangeLength,
      frequency
    );
    return candles;
  }
  //Uses that set of candles to make an array of only close prices for the set
  async getClosePriceRange(candles) {
    let range = [];
    for (let i = 0; i < candles.length; i++) {
      range.push(candles[i][4]);
    }
    return range;
  }

  //STRATEGIES
  //Uses set of close prices to calculate bollinger band data
  async testBollingerBands(curPair, rangeLength, frequency) {
    const fullCandles = await this.getFullCandles(
      curPair,
      rangeLength,
      frequency
    );
    //Gets an array of only close prices from the array of candles
    const closePriceRange = await this.getClosePriceRange(fullCandles);

    //Retrieves bollingerBand dataset
    const bollingerBands = await BollingerBands.getBollingerBands(
      closePriceRange,
      20
    );

    //Checks bollingerBands list for points when the price exited the outer bands
    const checkForBBSignal = (bollingerBands) => {
      for (let i = 0; i < bollingerBands.length; i++) {
        if (bollingerBands[i].pb > 1.0) {
          onSellSignal(i, closePriceRange);
        } else if (bollingerBands[i].pb < 0) {
          onBuySignal(i, closePriceRange);
        } else if (i == bollingerBands.length - 1) {
          closePositions();
        }
      }
    };

    const onBuySignal = (i) => {
      this.trade(i, fullCandles, "Buy");

      console.log(`PositionUSD: $${this.positionUSD}`);
      console.log(`PositionBTC: $${this.positionBTC}`);
      console.log(`PositionTotal: $${this.positionUSD + this.positionBTC}`);
    };

    const onSellSignal = (i) => {
      this.trade(i, fullCandles, "Sell");

      console.log(`PositionUSD: $${this.positionUSD}`);
      console.log(`PositionBTC: $${this.positionBTC}`);
      console.log(`PositionTotal: $${this.positionUSD + this.positionBTC}`);
    };
    const closePositions = () => {
      this.trade(bollingerBands.length - 1, fullCandles, "close");

      console.log("");
      console.log("Closing all positions");
      console.log(`PositionUSD: $${this.positionUSD}`);
    };
    checkForBBSignal(bollingerBands);
  }
}

module.exports = exports = Backtest;
