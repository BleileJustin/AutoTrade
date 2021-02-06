const BB = require("technicalindicators").BollingerBands;
const moment = require("moment");
const Price = require("../models/price.js");
const Analytics = require("../Analytics/index.js");

module.exports = {
  getBollingerBands: async () => {
    const numDays = 0;
    let historicRange = [];
    const curPair = "BTC-USD";

    const p = {
      period: 24,
      t0: moment().subtract(numDays, "days").subtract(6, "hours").toDate(),
      t1: moment().subtract(numDays, "days").toDate(),
      t2: moment().subtract(numDays, "days").add(6, "hours").toDate(),
    };

    const historicRates = await Analytics.getHistoricRates(curPair);
    for (let i = 0; i < 24 * 10; i++) {
      const oneMinClosePrice = historicRates[i][4];
      historicRange.push(oneMinClosePrice);
    }
    console.log(historicRange[historicRange.length - 1]);

    const calculateBollinger = async ({
      range,
      start,
      period,
      end = Date(),
    } = {}) => {
      const time = range.length - period;
      const input = {
        period: period,
        values: range,
        stdDev: 2,
      };
      const fullBB = BB.calculate(input);
      return fullBB; //[fullBB.length - 1];
    };

    const bol = await calculateBollinger({
      range: historicRange,
      start: p.t0,
      period: p.period,
      end: p.t2,
    });
    return bol;
  },
};
