const Analytics = require("../analytics/index.js");
const Price = require("../models/price.js");
const AuthClient = require("../authclient/index.js");
const database = require("../database/index.js");
//Dependencies
const moment = require("moment");
//Variables
const curPair = "BTC-USD";
let j = 0;
let i = 0;

//Database Loop

const mainLoop = async () => {
  try {
    //Creates priceEntry in MongoDB
    const priceEntry = await Analytics.getPriceEntry(curPair);
    const price = await Price.create(priceEntry);
    console.log(price);

    //Gets Candlestick price data
    const hRates = await Analytics.getHR(curPair);
    if (hRates != undefined) {
      const oneMinClosePrice = hRates[0][4];
    }

    //BB logic
    const numDays = 0;
    const p = {
      period: 24,
      t0: moment().subtract(numDays, "days").subtract(6, "hours").toDate(),
      t1: moment().subtract(numDays, "days").toDate(),
      t2: moment().subtract(numDays, "days").add(6, "hours").toDate(),
    };

    const bolRange = await Price.getRangeOfPrices({
      start: p.t1,
      end: p.t2,
    });

    const bol = await Price.getBollinger({
      range: bolRange,
      start: p.t0,
      period: p.period,
      end: p.t2,
    });
    console.log(bol);
    if (bol != undefined) {
      if (price.spot > bol.upper) {
        i++;
      } else if (price.spot < bol.lower) {
        j++;
      }
    }

    console.log("Spot price exceeded upper band " + i + " times.");
    console.log("Spot price deceeded lower band " + j + " times.");

    setTimeout(() => mainLoop(), 60 * 1000);
  } catch (error) {
    console.log(error);
  }
};

//**CONTROLLER**
module.exports = {
  start: async () => {
    await database.connect();

    const btcAccount = "40ca65d5-af9e-4fa0-878c-5316e12ee1bc";
    const authBtcAccount = await AuthClient.getAccount(btcAccount);
    const usdAccount = "619cb2fe-9fd1-41b6-8241-7debe1cdbf9f";
    const authUsdAccount = await AuthClient.getAccount(usdAccount);

    mainLoop();
  },
};
