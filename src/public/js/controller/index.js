const Broker = require("../models/broker/index.js");
const Backtest = require("../models/backtester/index.js");
const view = require("../views/index.js");
const apiKey = require("../models/key/index.js");
const database = require("../models/database/index.js");

//CONTROLLER //seconds;
const rangeLength = 60 * 100; //hours;

//Main broker controller

//Array of Broker instances
let brokers = [];
let curPair = "";
let candleFreq = 0;
let candleSize = 3600;
//Starts Broker
console.log(`TraderLith Version: 1.0.0`);

const startBroker = async () => {
  const exchangeDropdownState = view.checkExchangeDropdown();
  const strategyDropdownState = view.checkStrategyDropdown();
  const currencyDropdownState = view.checkCurrencyDropdown();

  const exchangeDropdownChoice = view.getExchangeChoice();
  const strategyDropdownChoice = view.getStrategyChoice();
  const currencyDropdownChoice = view.getCurrencyChoice();

  switch (exchangeDropdownChoice) {
    case "Binance":
      curPair = currencyDropdownChoice + "USD";
      candleFreq = "1h"; //one hour
      break;
    case "CoinbasePro":
      curPair = currencyDropdownChoice + "-USD";
      candleFreq = candleSize; //one hour
      break;
  }

  console.log(curPair);
  if (exchangeDropdownState == false) {
    alert("Please Select An Exchange");
  } else if (strategyDropdownState == false) {
    alert("Please Select A Strategy");
  } else if (currencyDropdownState == false) {
    alert("Please Select A Currency");
  } else {
    const broker = new Broker(
      currencyDropdownChoice,
      "USD",
      curPair,
      strategyDropdownChoice,
      exchangeDropdownChoice,
      candleSize
    );
    brokers.push(broker);
    console.log(candleFreq);
    await broker.start(candleFreq, rangeLength);
  }
};
//set 0 to choice of broker to stop
const stopBroker = () => {
  brokers[0].stop();
  brokers.splice(0);
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
