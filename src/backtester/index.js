const apiKey = require("../key/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const Macd = require("../strategies/MACD.js");
const HistoricRates = require("../historicalrates/index.js");

//BACKTESTER
class Backtest {
  constructor({ curPair, rangeLength }) {
    this.curPair = curPair;
    this.rangeLength = rangeLength;
    this.positionCRYP = 0;
    this.positionFIAT = 235;
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
  trade = (counter, closeRange, type, tradeAmt) => {
    //TODO Implement trade amount where it is taken depending on strategy
    const candleId = counter + 2; //Candle id that is = to BB id
    const candleClose = closeRange[candleId];
    const tradeAmt = this.positionFIAT * 0.5;

    this.previousTradePrice = this.currentTradePrice;
    this.currentTradePrice = parseInt(candleClose);

    if (this.previousTradePrice) {
      const relativeChange =
        (this.currentTradePrice - this.previousTradePrice) /
        this.previousTradePrice;
      this.positionCRYP += this.positionCRYP * relativeChange;
    }

    if (type === "Buy" && this.positionFIAT > tradeAmt) {
      this.positionFIAT -= tradeAmt;
      this.positionCRYP += tradeAmt;

      console.log("");
      console.log(type);
      console.log(`Trade Amount: $${tradeAmt}`);
    } else if (type === "Sell" && this.positionCRYP > tradeAmt) {
      this.positionFIAT += tradeAmt;
      this.positionCRYP -= tradeAmt;

      console.log("");
      console.log(type);
      console.log(`Trade Amount: $${tradeAmt}`);
    } else if (type == "close") {
      this.positionFIAT += this.positionCRYP;
      this.positionCRYP = 0;
    } else {
      console.log("");
      console.log("Trade FAILED");
    }
  };

  //ONSIGNALS
  onBuySignal = (i, closeRange) => {
    this.trade(i, closeRange, "Buy");

    console.log(`PositionFIAT: $${this.positionFIAT}`);
    console.log(`PositionCRYP: $${this.positionCRYP}`);
    console.log(`PositionTotal: $${this.positionFIAT + this.positionCRYP}`);
  };

  onSellSignal = (i, closeRange) => {
    this.trade(i, closeRange, "Sell");

    console.log(`PositionFIAT: $${this.positionFIAT}`);
    console.log(`PositionCRYP: $${this.positionCRYP}`);
    console.log(`PositionTotal: $${this.positionFIAT + this.positionCRYP}`);
  };

  closePositions = (closeRange, finalIndex) => {
    this.trade(finalIndex, closeRange, "close");

    console.log("");
    console.log("Closing all positions");
    console.log(`PositionFIAT: $${this.positionFIAT}`);
  };

  //BACKTESTED STRATEGIES
  //BOLLINGERBANDS BACKTEST
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

  //MACD BACKTEST
  async testMACD(curPair, rangeLength, frequency) {
    const fullCandles = await this.init(curPair, rangeLength, frequency);

    const closePriceRange = this.getClosePriceRange(fullCandles);

    const macd = await Macd.getMACD(closePriceRange);

    const checkForMACDSignal = (maCD) => {
      for (let i = 0; i < maCD.length - 2; i++) {
        if (
          maCD[i].MACD < maCD[i].signal &&
          maCD[i - 1].MACD > maCD[i - 1].signal
        ) {
          this.onSellSignal(i, closePriceRange);
        } else if (
          maCD[i].MACD > maCD[i].signal &&
          maCD[i - 1].MACD < maCD[i - 1].signal
        ) {
          this.onBuySignal(i, closePriceRange);
        }
      }
      this.closePositions(closePriceRange, maCD.length - 1);
    };
    checkForMACDSignal(macd);
  }
}

module.exports = exports = Backtest;
