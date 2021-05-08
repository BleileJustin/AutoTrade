const Broker = require("../models/broker/index.js");
const Backtest = require("../models/backtester/index.js");
const view = require("../views/index.js");
const apiKey = require("../models/key/index.js");
const database = require("../models/database/index.js");

//CONTROLLER
const curPair = apiKey.get("CURPAIR");
const candleFreq = 3600; //seconds;
const rangeLength = 60 * 300; //hours;
let socketArray = [];

//Main broker controller
//Fiat Accounts
const usdAccount = apiKey.get("USD_ACCOUNT");
//Crypto Accounts
const btcAccount = apiKey.get("BTC_ACCOUNT");
const ltcAccount = apiKey.get("LTC_ACCOUNT");

//Array of Broker instances
let brokers = [];

//Starts Broker
console.log(`TraderLith Version: 1.0.0`);

const startBroker = async () => {
  const exchangeDropdownState = view.checkExchangeDropdown();
  const strategyDropdownState = view.checkStrategyDropdown();
  const currencyDropdownState = view.checkCurrencyDropdown();

  const exchangeDropdownChoice = view.getExchangeChoice();
  const strategyDropdownChoice = view.getStrategyChoice();
  const currencyDropdownChoice = view.getCurrencyChoice();

  if (exchangeDropdownState == false) {
    alert("Please Select An Exchange");
  } else if (strategyDropdownState == false) {
    alert("Please Select A Strategy");
  } else if (currencyDropdownState == false) {
    alert("Please Select A Currency");
  } else {
    if (exchangeDropdownChoice == "Binance") {
      const broker = new Broker(
        currencyDropdownChoice,
        "USD",
        curPair,
        strategyDropdownChoice,
        exchangeDropdownChoice
      );
      brokers.push(broker);
      await broker.start(candleFreq, rangeLength);
    } else if (exchangeDropdownChoice == "CoinbasePro") {
      const broker = new Broker(
        ltcAccount,
        usdAccount,
        curPair,
        strategyDropdownChoice,
        exchangeDropdownChoice
      );
      brokers.push(broker);
      await broker.start(candleFreq, rangeLength);
    }
  }
};
//set 0 to choice of broker to stop
const stopBroker = () => {
  brokers[0].stop();
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
