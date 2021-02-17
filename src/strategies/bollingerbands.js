const BB = require("technicalindicators").BollingerBands;
const moment = require("moment");

//BOLLINGER BANDS STRATEGY

module.exports = {
  getBollingerBands: async (bbRange, bbPeriod) => {
    const numDays = 0;
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

    const bol = await calculateBollinger({
      range: bbRange,
      period: bbPeriod,
    });

    return bol;
  },
};
