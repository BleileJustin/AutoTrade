const Analytics = require("../analytics/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const AuthClient = require("../authclient/index.js");
const database = require("../database/index.js");
//Dependencies
const moment = require("moment");
//Variables
const curPair = "BTC-USD";

//Database Loop

const mainLoop = async () => {
  try {
    //Creates priceEntry in MongoDB
    /*const priceEntry = await Analytics.getPriceEntry(curPair);
    const price = await Price.create(priceEntry);
    console.log(price);
    */

    //BB
    const bb = await BollingerBands.getBollingerBands();
    console.log(bb[bb.length - 1]);

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
