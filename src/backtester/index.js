const apiKey = require("../key/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const HistoricRates = require("../historicalrates/index.js");

//BACKTESTER
class Backtest {
  constructor({ curPair, rangeLength }) {
    this.curPair = curPair;
    this.rangeLength = rangeLength;
    this.positionBTC = 0;
    this.positionUSD = 235;
    this.currentTradePrice;
    this.previousTradePrice;
  }

  //BACKTESTER INITIALIZATION
  //Begins by getting candle dataset
  async init(curPair, rangeLength, frequency) {
    const fullCandles = await this.getFullCandles(
      curPair,
      rangeLength,
      frequency
    );
    return fullCandles;
  }

  //Allows init() to get set of full candle data within the rangeLength
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
  getClosePriceRange = (candles) => {
    let range = [];
    for (let i = 0; i < candles.length; i++) {
      range.push(candles[i][4]);
    }
    return range;
  };

  //TRADE CONTROLLER
  //Simulates Trades
  trade = (counter, closeRange, type) => {
    const candleId = counter + 19; //Candle id that is = to BB id
    const candleClose = closeRange[candleId];
    const tradeAmt = this.positionUSD * 0.2;
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

      console.log("");
      console.log(type);
      console.log(`Trade Amount: $${tradeAmt}`);
    } else if (type === "Sell" && this.positionBTC > tradeAmt) {
      this.positionUSD += tradeAmt;
      this.positionBTC -= tradeAmt;

      console.log("");
      console.log(type);
      console.log(`Trade Amount: $${tradeAmt}`);
    } else if (type == "close") {
      this.positionUSD += this.positionBTC;
      this.positionBTC = 0;
    } else {
      console.log("");
      console.log("Trade FAILED");
    }
  };

  //ONSIGNALS
  onBuySignal = (i, closeRange) => {
    this.trade(i, closeRange, "Buy");

    console.log(`PositionUSD: $${this.positionUSD}`);
    console.log(`PositionBTC: $${this.positionBTC}`);
    console.log(`PositionTotal: $${this.positionUSD + this.positionBTC}`);
  };

  onSellSignal = (i, closeRange) => {
    this.trade(i, closeRange, "Sell");

    console.log(`PositionUSD: $${this.positionUSD}`);
    console.log(`PositionBTC: $${this.positionBTC}`);
    console.log(`PositionTotal: $${this.positionUSD + this.positionBTC}`);
  };

  closePositions = (closeRange, finalIndex) => {
    this.trade(finalIndex, closeRange, "close");

    console.log("");
    console.log("Closing all positions");
    console.log(`PositionUSD: $${this.positionUSD}`);
  };

  //BACKTESTED STRATEGIES
  //Uses set of close prices to calculate bollinger band data
  async testBollingerBands(curPair, rangeLength, frequency) {
    const fullCandles = await this.init(curPair, rangeLength, frequency);
    //Gets an array of only close prices from the array of candles
    const closePriceRange = this.getClosePriceRange(fullCandles);
    //Retrieves bollingerBand dataset
    const bollingerBands = await BollingerBands.getBollingerBands(
      closePriceRange,
      20
    );

    //Checks bollingerBands list for when the price exited the outer bands
    const checkForBBSignal = (bollingerBands) => {
      for (let i = 0; i < bollingerBands.length; i++) {
        if (bollingerBands[i].pb > 1.0) {
          this.onSellSignal(i, closePriceRange);
        } else if (bollingerBands[i].pb < 0) {
          this.onBuySignal(i, closePriceRange);
        }
      }

      this.closePositions(closePriceRange, bollingerBands.length - 1);
    };

    checkForBBSignal(bollingerBands);
  }
}

module.exports = exports = Backtest;
