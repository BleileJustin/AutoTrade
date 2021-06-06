const Broker = require("../models/broker/index.js"); //Trading instance controller
const Backtest = require("../models/backtester/index.js"); //Backtesting controlller
const brokerView = require("../views/brokerView.js"); //brokerView controller
const view = require("../views/index.js"); //Front end controller
const apiKey = require("../models/key/index.js"); //All the necessary variable for accessing exchange api's

//CONTROLLER;
const rangeLength = 60 * 100; //hours;
let brokers = []; //Array of Broker instances
let brokerId = 0;
let curPair = ""; //Trading Currency Pair
let candleFreq = 0; //Frequency of Candles
let candleSize = 3600; //1h //Size of Candles

console.log(`TraderLith Version: 3.1`);

//Result of clicking + button, creates trading instance on ui
const newBroker = async () => {
  const id = brokerId;
  const broker = new Broker(candleSize);
  brokers.push(broker); //Adds Trading instance to array for multiple trading instances running simultaneously
  await brokerView.newBrokerView(id);
  document.getElementById("start" + id).addEventListener("click", function () {
    startBroker(brokers[id], id);
  });
  document.getElementById("delete" + id).addEventListener("click", function () {
    deleteBroker(id); //Broken because it sends the latestbrokerId to delete broker
  });
  brokerId++;
};

//Begins a trading instance
const startBroker = async (broker, brokerId) => {
  const exchangeDropdownState = view.checkExchangeDropdown(brokerId);
  const strategyDropdownState = view.checkStrategyDropdown(brokerId);
  const currencyDropdownState = view.checkCurrencyDropdown(brokerId);

  const exchangeDropdownChoice = view.getExchangeChoice(brokerId);
  const strategyDropdownChoice = view.getStrategyChoice(brokerId);
  const currencyDropdownChoice = view.getCurrencyChoice(brokerId);

  //Changes the necessary variables to conform to the respective exchange
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

  //Check to see if all fields are filled before continuing
  if (exchangeDropdownState == false) {
    alert("Please Select An Exchange");
  } else if (strategyDropdownState == false) {
    alert("Please Select A Strategy");
  } else if (currencyDropdownState == false) {
    alert("Please Select A Currency");
  } else {
    await brokerView.switchButtonToStop(brokerId); //Changes start button to stop button

    await brokers[brokerId].start(
      curPair,
      candleFreq,
      rangeLength,
      "USD",
      currencyDropdownChoice,
      strategyDropdownChoice,
      exchangeDropdownChoice
    ); //Starts trading instance
    document
      .getElementById("stop" + brokerId)
      .addEventListener("click", function () {
        stopBroker(broker, brokerId);
      }); //Listens for the user to click stop
  }
};

//On click of stop button, Stops trading instance
//TODO: set 0 to choice of broker to stop
const stopBroker = async (broker, brokerId) => {
  await brokerView.switchButtonToStart(brokerId); //Changes the clicked stop button back to a start button
  document
    .getElementById("start" + brokerId)
    .addEventListener("click", function () {
      startBroker(broker, brokerId);
    }); //listens for the start button to be clicked to restart trading instance
  document
    .getElementById("delete" + brokerId)
    .addEventListener("click", function () {
      deleteBroker(brokerId);
    });
  await broker.stop(); // stops trading instance
};

const deleteBroker = async (id) => {
  brokers.splice(id, 1, ""); // removes trading instance from broker array
  brokerView.deleteBrokerView(id);
};
//Tests Strategies with BackData
const backtest = async () => {
  const backTester = new Backtest(curPair, rangeLength);
  //runs Strategy through backtester
  await backTester.testBollingerBands(curPair, rangeLength, candleFreq, 4); //Tests the BollingerBands TA strategy over historical data
  //await backTester.testMACD(curPair, rangeLength, candleFreq);
  //await backTester.testBuyAndHold(curPair, rangeLength, candleFreq, 12);
  //await backTester.testOrder(curPair);
};

//Listens for the + button to be clicked to add a new trading instance to ui
window.onload = () => {
  document.getElementById("plus-button").addEventListener("click", newBroker);
};
