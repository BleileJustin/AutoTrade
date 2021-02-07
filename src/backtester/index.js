const apiKey = require("../key/index.js");
const HistoricRates = require("../historicalrates/index.js");
class Backtest {
  constructor({ curPair }) {
    this.curPair = curPair;
  }
  async start(curPair) {
    const historicRates = new HistoricRates(curPair);
    const range = await historicRates.getHistoricRates(curPair);
    console.log(range);
  }
  async onBuySignal() {}

  async onSellSignal() {}
}

module.exports = exports = Backtest;
