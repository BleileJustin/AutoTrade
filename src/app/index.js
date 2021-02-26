const Socket = require("../socket/index.js");
const Backtest = require("../backtester/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const AuthClient = require("../authclient/index.js");
const HistoricRates = require("../historicalrates/index.js");
const database = require("../database/index.js");
const apiKey = require("../key/index.js");
const moment = require("moment");

//CONTROLLER

const curPair = apiKey.get("CURPAIR");
const candleFreq = 300; //in seconds
const rangeLength = 60 * 18; //in minutes
let socketArray = [];

//Main broker controller
const main = async () => {};

//Pseudo-broker controller
const backtest = async () => {
  const backTester = new Backtest(curPair, rangeLength);
  //runs BollingerBands through backtester
  await backTester.testBollingerBands(curPair, rangeLength, candleFreq);
};

module.exports = {
  start: async () => {
    //Connects to MongoDB database
    //await database.connect();

    //Connects to authorized CoinbasePro account
    const btcAccount = "40ca65d5-af9e-4fa0-878c-5316e12ee1bc";
    const authBtcAccount = await AuthClient.getAccount(btcAccount);
    const usdAccount = "619cb2fe-9fd1-41b6-8241-7debe1cdbf9f";
    const authUsdAccount = await AuthClient.getAccount(usdAccount);

    //main();
    backtest();
  },
};
