const Broker = require("../models/broker/index.js");
const Backtest = require("../models/backtester/index.js");
const AuthClient = require("../models/authclient/index.js");
const view = require("../views/index.js");
const apiKey = require("../models/key/index.js");
const database = require("../models/database/index.js");

//CONTROLLER
const curPair = apiKey.get("CURPAIR");
const candleFreq = 3600; //seconds;
const rangeLength = 60 * 300; //hours;
let socketArray = [];

//Main broker controller
//Connects to authorized CoinbasePro account
//Fiat Accounts
const usdAccount = apiKey.get("USD_ACCOUNT");
//Crypto Accounts
const btcAccount = apiKey.get("BTC_ACCOUNT");
const ltcAccount = apiKey.get("LTC_ACCOUNT");

//Starts Broker
console.log(`AutoTrade Version: 0.2.1`);
const broker = new Broker(ltcAccount, usdAccount, curPair);

const startBroker = async () => {
  const exchangeDropdownState = view.checkExchangeDropdown();
  const strategyDropdownState = view.checkStrategyDropdown();
  if (exchangeDropdownState == false) {
    alert("Please Select An Exchange");
  } else if (strategyDropdownState == false) {
    alert("Please Select A Strategy");
  } else {
    await broker.start(candleFreq, rangeLength);
  }
};

const stopBroker = () => {
  broker.stop();
};
//Tests Strategies with BackData
const backtest = async () => {
  const backTester = new Backtest(curPair, rangeLength);
  //runs Strategy through backtester
  await backTester.testBollingerBands(curPair, rangeLength, candleFreq, 4);
  //await backTester.testMACD(curPair, rangeLength, candleFreq);
  //await backTester.testBuyAndHold(curPair, rangeLength, candleFreq, 12);
  //await backTester.testOrder(curPair);
};
window.onload = () => {
  document.getElementById("start").addEventListener("click", startBroker);
  document.getElementById("stop").addEventListener("click", stopBroker);
};