const Broker = require("../broker/index.js");
const Backtest = require("../backtester/index.js");
const AuthClient = require("../authclient/index.js");
const apiKey = require("../key/index.js");
const database = require("../database/index.js");

//CONTROLLER
const curPair = apiKey.get("CURPAIR");
const candleFreq = 21600; //seconds;
const rangeLength = 60 * 1200; //hours;
let socketArray = [];

//Main broker controller
const main = async () => {
  //Connects to authorized CoinbasePro account
  //Fiat Accounts
  const usdAccount = apiKey.get("USD_ACCOUNT");
  //Crypto Accounts
  const btcAccount = apiKey.get("BTC_ACCOUNT");
  const ltcAccount = apiKey.get("LTC_ACCOUNT");
  //Starts Broker
  const broker = new Broker(ltcAccount, usdAccount, curPair);
  await broker.start(candleFreq, rangeLength);
};

//Tests Strategies with BackData
const backtest = async () => {
  const backTester = new Backtest(curPair, rangeLength);
  //runs BollingerBands through backtester
  await backTester.testBollingerBands(curPair, rangeLength, candleFreq);
  //await backTester.testMACD(curPair, rangeLength, candleFreq);
};

module.exports = {
  start: async () => {
    //Connects to MongoDB database
    await database.connect();

    await main();
    backtest();
  },
};
