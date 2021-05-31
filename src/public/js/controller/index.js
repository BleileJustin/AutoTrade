const Broker = require("../models/broker/index.js"); //Trading instance controller
const Backtest = require("../models/backtester/index.js"); //Backtesting controlller
const brokerView = require("../views/brokerView.js"); //brokerView controller
const view = require("../views/index.js"); //Front end controller
const apiKey = require("../models/key/index.js"); //All the necessary variable for accessing exchange api's

//CONTROLLER;
const rangeLength = 60 * 100; //hours;
let brokers = []; //Array of Broker instances
let curPair = ""; //Trading Currency Pair
let candleFreq = 0; //Frequency of Candles
let candleSize = 3600; //1h //Size of Candles

console.log(`TraderLith Version: 2.1`);

//Result of clicking + button, creates trading instance on ui
const newBrokerView = async () => {
  await brokerView.newBrokerView();

  document.getElementById("start").addEventListener("click", startBroker);
};

//Begins a trading instance
const startBroker = async () => {
  const exchangeDropdownState = view.checkExchangeDropdown();
  const strategyDropdownState = view.checkStrategyDropdown();
  const currencyDropdownState = view.checkCurrencyDropdown();

  const exchangeDropdownChoice = view.getExchangeChoice();
  const strategyDropdownChoice = view.getStrategyChoice();
  const currencyDropdownChoice = view.getCurrencyChoice();

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
    //Create new Trading intstance
    const broker = new Broker(
      currencyDropdownChoice,
      "USD",
      curPair,
      strategyDropdownChoice,
      exchangeDropdownChoice,
      candleSize
    );
    await brokerView.switchButtonToStop(); //Changes start button to stop button
    document.getElementById("stop").addEventListener("click", stopBroker); //Listens for the user to click stop
    brokers.push(broker); //Adds Trading instance to array for multiple trading instances running simultaneously
    await broker.start(candleFreq, rangeLength); //Starts trading instance
  }
};

//On click of stop button, Stops trading instance
//TODO: set 0 to choice of broker to stop
const stopBroker = async () => {
  await brokerView.switchButtonToStart(); //Changes the clicked stop button back to a start button
  document.getElementById("start").addEventListener("click", startBroker); //listens for the start button to be clicked to restart trading instance
  brokers[0].stop(); // stops trading instance
  brokers.splice(0); // removes trading instance from broker array
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
  document
    .getElementById("plus-button")
    .addEventListener("click", newBrokerView);
};
