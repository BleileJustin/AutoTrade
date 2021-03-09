const BB = require("technicalindicators").BollingerBands;
const moment = require("moment");

//BOLLINGER BANDS STRATEGY

module.exports = {
  getBollingerBands: async (bbRange, bbPeriod) => {
    const calculateBollinger = async ({ range, period } = {}) => {
      const input = {
        period: period,
        values: range,
        stdDev: 2.6, //2.6 for 6 hour candles is perfect
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
