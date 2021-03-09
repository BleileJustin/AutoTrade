const apiKey = require("../key/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const Macd = require("../strategies/MACD.js");
const HistoricRates = require("../historicalrates/index.js");

//BACKTESTER
class Backtest {
  constructor({ curPair, rangeLength }) {
    this.curPair = curPair;
    this.rangeLength = rangeLength;
    this.positionCRYP = 600;
    this.positionFIAT = 100;
    this.currentTradePrice;
    this.previousTradePrice;
    this.fees;
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
    const candleId = counter + counterDly; //counterDelay is how many intervals before the strategy begins
    const candleClose = closeRange[candleId];
    console.log(candleClose);
    this.previousTradePrice = this.currentTradePrice;
    this.currentTradePrice = parseFloat(candleClose);
    //Keeps track of the change in Crypto price and mirrors that to the position
    if (this.previousTradePrice) {
      //calculates the relativeChange between the last trade price and the current trade price
      const relativeChange =
        (this.currentTradePrice - this.previousTradePrice) /
        this.previousTradePrice;
      const priceChange = this.positionCRYP * relativeChange; //calculates the price change on positionCRYP
      this.positionCRYP += priceChange; //changes positionCRYP based off priceChange
    }

    //Keeps track of positions when buying and selling
    if (type === "Buy" && this.positionFIAT > tradeAmt) {
      this.fees = tradeAmt * 0.005;
      this.positionFIAT -= this.fees; //Simulates trading fees
      this.positionFIAT -= tradeAmt;
      this.positionCRYP += tradeAmt;
      console.log("");
      console.log(type);
      console.log(`Trade Amount : $${tradeAmt}`);
    } else if (type === "Sell" && this.positionCRYP > tradeAmt) {
      this.fees = tradeAmt * 0.005;
      this.positionFIAT -= this.fees; //Simulates trading fees
      this.positionFIAT += tradeAmt;
      this.positionCRYP -= tradeAmt;
      console.log("");
      console.log(type);
      console.log(`Trade Amount : $${tradeAmt}`);
    } else if (type == "close") {
      this.fees = tradeAmt * 0.005;
      this.positionFIAT -= this.fees;
      this.positionFIAT += this.positionCRYP;
      this.positionCRYP = 0;
    } else {
      this.fees = 0;
      console.log("");
      console.log("Trade FAILED");
    }
  };

  //ONSIGNALS
  openPositions = (i, closeRange, tradeAmount, counterDelay) => {
    this.trade(i, closeRange, "Buy", tradeAmount, counterDelay);

    console.log(`PositionFIAT : $${this.positionFIAT}`);
    console.log(`PositionCRYP : $${this.positionCRYP}`);
    console.log(`PositionTotal: $${this.positionFIAT + this.positionCRYP}`);
  };
  //Executes pseudo-trade when buy or sell signal is recieved
  onBuySignal = (i, closeRange, tradeAmount, counterDelay) => {
    this.trade(i, closeRange, "Buy", tradeAmount, counterDelay);

    console.log(`PositionFIAT : $${this.positionFIAT}`);
    console.log(`PositionCRYP : $${this.positionCRYP}`);
    console.log(`PositionTotal: $${this.positionFIAT + this.positionCRYP}`);
  };

  onSellSignal = (i, closeRange, tradeAmount, counterDelay) => {
    this.trade(i, closeRange, "Sell", tradeAmount, counterDelay);

    console.log(`PositionFIAT : $${this.positionFIAT}`);
    console.log(`PositionCRYP : $${this.positionCRYP}`);
    console.log(`PositionTotal: $${this.positionFIAT + this.positionCRYP}`);
  };

  closePositions = (closeRange, finalIndex, tradeAmount, counterDelay) => {
    console.log("");
    console.log("Closing all positions");
    console.log(`PositionFIAT : $${this.positionFIAT}`);
    console.log(`PositionCRYP : $${this.positionCRYP}`);

    this.trade(finalIndex, closeRange, "close", tradeAmount, counterDelay);
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
          // BB sell signal
          this.onSellSignal(
            i,
            closePriceRange,
            this.positionCRYP * 0.5, //tradeAmt
            strategyDelay
          );
          console.log(`Trade Price  : $${closePriceRange[i + strategyDelay]}`);
          console.log(`Trade Fee    : $${this.fees}`);
        } else if (bollingerBands[i].pb < 0) {
          // BB buy signal
          this.onBuySignal(
            i,
            closePriceRange,
            this.positionFIAT * 0.5, //tradeAmt
            strategyDelay
          );
          console.log(`Trade Price  : $${closePriceRange[i + strategyDelay]}`);
          console.log(`Trade Fee    : $${this.fees}`);
        }
      }

      this.closePositions(
        closePriceRange,
        bollingerBands.length - 1,
        this.positionFIAT,
        strategyDelay
      );
      console.log(
        `Trade Price: $${
          closePriceRange[bollingerBands.length + strategyDelay - 1]
        }`
      );
      console.log(`Trade Fee: $${this.fees}`);
    };

    checkForBBSignal(bollingerBands);
  }

  //MACD BACKTEST
  async testMACD(curPair, rangeLength, frequency) {
    const fullCandles = await this.init(curPair, rangeLength, frequency);
    const closePriceRange = this.getClosePriceRange(fullCandles);
    console.log(closePriceRange);
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
            positionTotal * 0.5,
            strategyDelay
          );
          console.log(`Trade Price: $${closePriceRange[i + strategyDelay]}`);
        } else if (
          maCD[i].MACD > maCD[i].signal &&
          maCD[i - 1].MACD < maCD[i - 1].signal
        ) {
          this.onBuySignal(
            i,
            closePriceRange,
            positionTotal * 0.5,
            strategyDelay
          );
          console.log(`Trade Price: $${closePriceRange[i + strategyDelay]}`);
          console.log(`Trade Fee: $${this.fees}`);
        }
      }
      this.closePositions(
        closePriceRange,
        maCD.length - 1,
        this.positionFIAT,
        strategyDelay
      );
    };
    checkForMACDSignal(macd);
  }

  //BUY AND HOLD BACKTEST
  async testBuyAndHold(curPair, rangeLength, frequency) {
    const fullCandles = await this.init(curPair, rangeLength, frequency);
    const closePriceRange = this.getClosePriceRange(fullCandles);
    const positionTotal = this.positionFIAT + this.positionCRYP;
    const strategyDelay = 0;
    this.onBuySignal(
      0,
      closePriceRange,
      this.positionFIAT - 0.5,
      strategyDelay
    );
    this.closePositions(
      closePriceRange,
      closePriceRange.length - 1,
      this.positionFIAT,
      strategyDelay
    );
  }
}

module.exports = exports = Backtest;
