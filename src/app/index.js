const Socket = require("../socket/index.js");
const Backtest = require("../backtester/index.js");
const BollingerBands = require("../strategies/bollingerbands.js");
const AuthClient = require("../authclient/index.js");
const database = require("../database/index.js");
const apiKey = require("../key/index.js");
//Dependencies
const moment = require("moment");
//Variables
const curPair = apiKey.get("CURPAIR");
let socketArray = [];

const main = async () => {
  //Backtester
  const backTester = new Backtest(curPair);
  backTester.start(curPair);

  //Bollinger Bands
  //Websocket
  /*const socket = new Socket.Socket({
      curPair,
      onMessage: (data) => {
        if (data.type == "ticker") {
          socketArray.push(data.price);
        }
      },
      onError: (err) => console.log(err),
    });
    socket.start();
    */
};

//**CONTROLLER**
module.exports = {
  start: async () => {
    await database.connect();

    const btcAccount = "40ca65d5-af9e-4fa0-878c-5316e12ee1bc";
    const authBtcAccount = await AuthClient.getAccount(btcAccount);
    const usdAccount = "619cb2fe-9fd1-41b6-8241-7debe1cdbf9f";
    const authUsdAccount = await AuthClient.getAccount(usdAccount);

    main();
  },
};
