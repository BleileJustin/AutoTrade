const BB = require("technicalindicators").BollingerBands;
const moment = require("moment");
const apiKey = require("../key/index.js");

//BOLLINGER BANDS STRATEGY

module.exports = {
  getMACD: async (range, period) => {
    const curPair = apiKey.get("CURPAIR");
  },
};
