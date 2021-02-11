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
      for (let s = 0; i < bol.length; i++) {
        if (bol.pb > 1.0) {
          onBuySignal();
        } else if (bol.pb < 0) {
          onSellSignal();
        }
      }
    };
    const onBuySignal = async () => {};
    const onSellSignal = async () => {};
    return bol;
  },
};
