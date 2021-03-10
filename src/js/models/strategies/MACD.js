const MACD = require("technicalindicators").MACD;

//MOVING AVERAGE CONVERGENCE DIVERGENCE STRATEGY

module.exports = {
  getMACD: async (range) => {
    const calculateMACD = async ({ range } = {}) => {
      const input = {
        values: range,
        fastPeriod: 5,
        slowPeriod: 8,
        signalPeriod: 3,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      };

      const fullMACD = MACD.calculate(input);
      return fullMACD;
    };
    const macd = await calculateMACD({
      range: range,
    });
    return macd;
  },
};