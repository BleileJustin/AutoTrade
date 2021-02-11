const BB = require("technicalindicators").BollingerBands;
const moment = require("moment");

module.exports = {
  getBollingerBands: async (historicRange) => {
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
      range: historicRange,
      period: 20,
    });

    const checkForSignal = async () => {
      for (let s = 0; i < bol.length; i++) {}
    };
    const onBuySignal = async (bol) => {};
    const onSellSignal = async (bol) => {};
    return bol;
  },
};
