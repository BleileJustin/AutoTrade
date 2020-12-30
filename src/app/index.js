const Analytics = require("../analytics/index.js");
const Price = require("../models/price.js");
const AuthClient = require("../authclient/index.js");
const Websocket = require("../websocket/index.js");
const database = require("../database/index.js");
//Dependencies
const moment = require("moment");
//Variables
const curPair = "BTC-USD";

//Database Loop
const mainLoop = async () => {
  try {
    /*
    const priceEntry = await Analytics.getPriceEntry(curPair);
    const price = await Price.create(priceEntry);
    console.log(price);

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
    //console.log(bolRange);

    const bol = await Price.getBollinger({
      range: bolRange,
      start: p.t0,
      period: p.period,
      end: p.t2,
    });
    console.log(bol);

    setTimeout(() => mainLoop(), 10 * 1000);
    */
  } catch (error) {
    console.log(error);
  }
};
//mainLoop();

//**CONTROLLER**
module.exports = {
  start: async () => {
    await database.connect();
    const btcAccount = "40ca65d5-af9e-4fa0-878c-5316e12ee1bc";
    const authBtcAccount = await AuthClient.getAccount(btcAccount);

    const usdAccount = "619cb2fe-9fd1-41b6-8241-7debe1cdbf9f";
    await AuthClient.getAccount(usdAccount);

    /*
    const numDays = 4;
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
    console.log(bolRange);

    const bol = await Price.getBollinger({
      range: bolRange,
      start: p.t0,
      period: p.period,
      end: p.t2,
    });
    console.log(bol);
    */

    //const upperRange = bol[0].upper;
    //console.log(upperRange);

    //const mean = await Price.getMean({ start: p.t0, end: p.t1 });
    //console.log(mean);

    //await Websocket.subscribe();
    //await Websocket.getData();
  },
};
