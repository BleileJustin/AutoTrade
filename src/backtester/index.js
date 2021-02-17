const apiKey = require("../key/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const HistoricRates = require("../historicalrates/index.js");

//BACKTESTER

class Backtest {
  constructor({ curPair, rangeLength }) {
    this.curPair = curPair;
    this.rangeLength = rangeLength;
  }
  //Gets set of full candle data using a rangeLength
  async getFullCandles(curPair, rangeLength) {
    const historicRatesController = new HistoricRates(curPair, rangeLength);
    const candles = await historicRatesController.getHistoricRange(
      curPair,
      rangeLength
    );
    return candles;
  }
  //Uses that set of candles to make an array of only close prices for the set
  async getClosePriceRange(candles) {
    let range = [];
    for (let i = 0; i < candles.length; i++) {
      /*  console.log(i);
      console.log(
        `Time:  ${rates[i][0]},
         Low:   ${rates[i][1]},
         High:  ${rates[i][2]},
         Open:  ${rates[i][3]},
         Close: ${rates[i][4]}
         `);
      */
      range.push(candles[i][4]);
    }
    return range;
  }
  //Uses set of close prices to calculate bollinger band data
  async testBollingerBands(curPair, rangeLength) {
    let positionUSD = 10000;
    let positionBTC = 5000;
    //Variables to track the relative price change between positions and market value
    let previousTradePrice;
    let currentTradePrice;
    const fullCandles = await this.getFullCandles(curPair, rangeLength);
    //Gets an array of only close prices from the array of candles
    const closePriceRange = await this.getClosePriceRange(fullCandles);

    //Retrieves bollingerBand dataset
    const bollingerBands = await BollingerBands.getBollingerBands(
      closePriceRange,
      20
    );

    //Checks bollingerBands list for points when the price exited the outer bands
    function checkForSignal(bollingerBands) {
      for (let i = 0; i < bollingerBands.length; i++) {
        if (bollingerBands[i].pb > 1.0) {
          onSellSignal(i, closePriceRange);
        } else if (bollingerBands[i].pb < 0) {
          onBuySignal(i, closePriceRange);
        } else if (i == bollingerBands.length - 1) {
          closePositions(i);
        }
      }
    }

    function trade(counter, fullCandlesticks, type) {
      const candleId = counter + 20; //Candle id that is = to BB id
      const candleClose = fullCandlesticks[candleId][4];
      const tradeAmt = candleClose * 0.03;
      previousTradePrice = currentTradePrice;
      currentTradePrice = parseInt(candleClose);
      if (previousTradePrice) {
        const relativeChange =
          (currentTradePrice - previousTradePrice) / previousTradePrice;
        positionBTC += positionBTC * relativeChange;
      }

      if (type == "buy" && positionUSD > tradeAmt) {
        positionUSD -= tradeAmt;
        positionBTC += tradeAmt;
      } else if (type == "sell" && positionBTC > tradeAmt) {
        positionUSD += tradeAmt;
        positionBTC -= tradeAmt;
      } else if (type == "close") {
        console.log("Closing all positions");
        positionUSD += positionBTC;
        positionBTC = 0;
        console.log(`PositionUSD: $${positionUSD}`);
      } else {
        console.log("Trade FAILED");
      }
    }

    function onBuySignal(i) {
      trade(i, fullCandles, "buy");

      console.log("");
      console.log("Buy");
      console.log(`PositionUSD: $${positionUSD}`);
      console.log(`PositionBTC: $${positionBTC}`);
    }

    function onSellSignal(i) {
      trade(i, fullCandles, "sell");

      console.log("");
      console.log("Sell");
      console.log(`PositionUSD: $${positionUSD}`);
      console.log(`PositionBTC: $${positionBTC}`);
    }
    function closePositions(i) {
      trade(i - 40, fullCandles, "close");
    }

    checkForSignal(bollingerBands);
  }
}

module.exports = exports = Backtest;
