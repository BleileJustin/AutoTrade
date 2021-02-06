const BB = require("technicalindicators").BollingerBands;
const moment = require("moment");
const Analytics = require("../Analytics/index.js");

module.exports = {
  getBollingerBands: async () => {
    const numDays = 0;
    let historicRange = [];
    const curPair = "BTC-USD";

    const calculateBollinger = async ({ range, period } = {}) => {
      const input = {
        period: period,
        values: range,
        stdDev: 2,
      };
      const fullBB = BB.calculate(input);
      return fullBB;
    };

    const historicRates = await Analytics.getHistoricRates(curPair);
    for (let i = 0; i < historicRates.length; i++) {
      historicRange.unshift(historicRates[i][4]);
    }

    const bol = await calculateBollinger({
      range: historicRange,
      period: 20,
    });
    return bol;
  },
};
