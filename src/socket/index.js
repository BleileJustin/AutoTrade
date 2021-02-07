//Dependencies
const apiKey = require("../key/index.js");
const CoinbasePro = require("coinbase-pro");
const moment = require("moment");
const pubClient = new CoinbasePro.PublicClient();

//**TRADING CONTROLLER***

class Socket {
  constructor({ curPair, onMessage, onError }) {
    this.product = curPair;
    this.onMessage = onMessage;
    this.onError = onError;
    this.running = false;
  }

  start() {
    this.running = true;
    this.client = new CoinbasePro.WebsocketClient(
      this.product,
      apiKey.get("WEBSOCKET_URL"),
      {
        key: apiKey.get("COINBASE_API_KEY"),
        secret: apiKey.get("COINBASE_API_SECRET"),
        passphrase: apiKey.get("COINBASE_API_PASSPHRASE"),
      },
      { channels: ["ticker", "heartbeat"] }
    );

    this.client.on("message", async (data) => {
      await this.onMessage(data);
    });
    this.client.on("error", (err) => {
      console.log(err);
      this.client.connect();
    });
    this.client.on("close", () => {
      if (this.running) {
        this.client.connect();
      }
    });
  }

  stop() {
    this.running = false;
    this.client.close();
  }
}

module.exports = exports = Socket;
