const apiKey = require("../key/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const Macd = require("../strategies/MACD.js");
const HistoricRates = require("../historicalrates/index.js");

//BACKTESTER
class Backtest {
  constructor({ curPair, rangeLength }) {
    this.curPair = curPair;
    this.rangeLength = rangeLength;
    this.positionCRYP = 172.4;
    this.positionFIAT = 80;
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
      range.unshift(candles[i][4]);
    }
    return range;
  };

  //TRADE CONTROLLER
  //Simulates Trades
  trade = (counter, closeRange, type, tradeAmt, counterDly) => {
    //TODO Implement trade amount and counter delay where it is taken depending on strategy
    const candleId = counter + counterDly; //counterDelay is how many intervals before the strategy begins
    const candleClose = closeRange[candleId];

    this.previousTradePrice = this.currentTradePrice;
    this.currentTradePrice = parseInt(candleClose);

    //Keeps track of the change in Crypto price and mirrors that to my position
    if (this.previousTradePrice) {
      const relativeChange =
        (this.currentTradePrice - this.previousTradePrice) /
        this.previousTradePrice;
      this.positionCRYP += this.currentTradePrice * relativeChange;
    }

    //Keeps track of positions when buying and selling
    if (type === "Buy" && this.positionFIAT > tradeAmt) {
      this.positionFIAT -= tradeAmt;
      this.positionCRYP += tradeAmt;
      //this.positionFIAT -= tradeAmt * 0.05; //Simulates trading fees
      console.log("");
      console.log(type);
      console.log(`Trade Amount: $${tradeAmt}`);
    } else if (type === "Sell" && this.positionCRYP > tradeAmt) {
      this.positionFIAT += tradeAmt;
      this.positionCRYP -= tradeAmt;
      //this.positionFIAT -= tradeAmt * 0.05; //Simulates trading fees
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
  //Executes trade when buy or sell signal is recieved
  onBuySignal = (i, closeRange, tradeAmount, counterDelay) => {
    this.trade(i, closeRange, "Buy", tradeAmount, counterDelay);

    console.log(`PositionFIAT: $${this.positionFIAT}`);
    console.log(`PositionCRYP: $${this.positionCRYP}`);
    console.log(`PositionTotal: $${this.positionFIAT + this.positionCRYP}`);
  };

  onSellSignal = (i, closeRange, tradeAmount, counterDelay) => {
    this.trade(i, closeRange, "Sell", tradeAmount, counterDelay);

    console.log(`PositionFIAT: $${this.positionFIAT}`);
    console.log(`PositionCRYP: $${this.positionCRYP}`);
    console.log(`PositionTotal: $${this.positionFIAT + this.positionCRYP}`);
  };

  closePositions = (closeRange, finalIndex, counterDelay) => {
    console.log("");
    console.log("Closing all positions");
    console.log(`PositionFIAT: $${this.positionFIAT}`);
    console.log(`PositionCRYP: $${this.positionCRYP}`);

    this.trade(finalIndex, closeRange, "close", undefined, counterDelay);
    console.log(`PositionTotal: $${this.positionFIAT + this.positionCRYP}`);
  };

  //BACKTESTED STRATEGIES
  //Gets the price range and checks for buy and sell signals

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
      const strategyDelay = 19;
      for (let i = 0; i < bollingerBands.length; i++) {
        const positionTotal = this.positionFIAT + this.positionCRYP;
        if (bollingerBands[i].pb > 1.0) {
          console.log(closePriceRange[i + strategyDelay]);
          this.onSellSignal(
            i,
            closePriceRange,
            positionTotal * 0.3,
            strategyDelay
          );
        } else if (bollingerBands[i].pb < 0) {
          console.log(closePriceRange[i + strategyDelay]);
          this.onBuySignal(
            i,
            closePriceRange,
            positionTotal * 0.3,
            strategyDelay
          );
        }
      }

      this.closePositions(
        closePriceRange,
        bollingerBands.length - 1,
        strategyDelay
      );
    };

    checkForBBSignal(bollingerBands);
  }

  //MACD BACKTEST
  async testMACD(curPair, rangeLength, frequency) {
    const fullCandles = await this.init(curPair, rangeLength, frequency);

    const closePriceRange = this.getClosePriceRange(fullCandles);

    const macd = await Macd.getMACD(closePriceRange);

    const checkForMACDSignal = (maCD) => {
      const strategyDelay = 2;
      for (let i = 0; i < maCD.length - 1; i++) {
        const positionTotal = this.positionFIAT + this.positionCRYP;
        if (
          maCD[i].MACD < maCD[i].signal &&
          maCD[i - 1].MACD > maCD[i - 1].signal
        ) {
          this.onSellSignal(
            i,
            closePriceRange,
            positionTotal * 0.8,
            strategyDelay
          );
        } else if (
          maCD[i].MACD > maCD[i].signal &&
          maCD[i - 1].MACD < maCD[i - 1].signal
        ) {
          this.onBuySignal(
            i,
            closePriceRange,
            positionTotal * 0.8,
            strategyDelay
          );
        }
      }
      this.closePositions(closePriceRange, maCD.length - 1, strategyDelay);
    };
    checkForMACDSignal(macd);
  }
}

module.exports = exports = Backtest;
