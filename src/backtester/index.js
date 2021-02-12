const apiKey = require("../key/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const HistoricRates = require("../historicalrates/index.js");

class Backtest {
  constructor({ curPair, rangeLength }) {
    this.curPair = curPair;
    this.rangeLength = rangeLength;
  }

  async getFullCandles(curPair, rangeLength) {
    const historicRatesController = new HistoricRates(curPair, rangeLength);
    const candles = await historicRatesController.getHistoricRange(
      curPair,
      rangeLength
    );
    return candles;
  }

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

  async testBollingerBands(curPair, rangeLength) {
    const fullCandles = await this.getFullCandles(curPair, rangeLength);
    const closePriceRange = await this.getClosePriceRange(fullCandles);

    const bollingerBands = await BollingerBands.getBollingerBands(
      closePriceRange
    );

    function checkForSignal(bollingerBands) {
      for (let i = 0; i < bollingerBands.length; i++) {
        if (bollingerBands[i].pb > 1.0) {
          onSellSignal(bollingerBands[i], i, closePriceRange);
        } else if (bollingerBands[i].pb < 0) {
          onBuySignal(bollingerBands[i], i, closePriceRange);
        }
      }
    }

    function onBuySignal(bb, i, range) {
      console.log("");
      const candleId = i + 19; //Candle id that is = to BB id
      console.log(candleId);
      console.log(range[candleId]);
      console.log(fullCandles[candleId]);
      console.log("Buy");
      console.log(bb);
    }

    function onSellSignal(bb, i, range) {
      console.log("");
      const candleId = i + 19; //Candle id that is = to BB id
      console.log(candleId);
      console.log(range[candleId]);
      console.log(fullCandles[candleId]);
      console.log("Sell");
      console.log(bb);
    }

    checkForSignal(bollingerBands);
    console.log(`
      BollingerBands Length: ${bollingerBands.length}
    `);
  }
}

module.exports = exports = Backtest;
