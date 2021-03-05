const AuthClient = require("../authclient/index.js");
const apiKey = require("../key/index.js");

class Broker {
  constructor({ crypAccount, fiatAccount }) {
    this.crypAccount = crypAccount;
    this.fiatAccount = fiatAccount;
  }

  async start(crypAccount, fiatAccount) {
    //Connects to authorized CoinbasePro account
    const authCRYPAccount = await AuthClient.getAccount(crypAccount);
    const authFIATAccount = await AuthClient.getAccount(fiatAccount);
  }
}

module.exports = exports = Broker;
