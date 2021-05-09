const apiKey = require("../key/index.js");
const CoinbasePro = require("coinbase-pro");

const apiURI = "https://api.pro.coinbase.com";
//const apiURI = "/coinbase-pro";

const key = apiKey.get("COINBASE_API_KEY");
const secret = apiKey.get("COINBASE_API_SECRET");
const passphrase = apiKey.get("COINBASE_API_PASSPHRASE");
const socketUrl = apiKey.get("WEBSOCKET_URL");
const sandboxURI = "https://api.pro.coinbase.com";
const useSandbox = false;

const aClient = new CoinbasePro.AuthenticatedClient(
  key,
  secret,
  passphrase,
  apiURI
);

class CBAuthClient {
  constructor() {}

  placeOrder = async (params) => {
    const order = aClient.placeOrder(params);
    return order;
  };
  getAccount = async (id) => {
    const account = await aClient.getAccount(id);
    console.log(account.available);
    return account;
  };
  getAccounts = async (id) => {
    const accounts = await aClient.getAccounts();
    console.log(accounts);
    return accounts;
  };
  getAvailable = async (id) => {
    let available = "";
    let accountId = "";
    let account = "";

    switch (id) {
      case "USD":
        accountId = apiKey.get("USD_ACCOUNT");
        account = await aClient.getAccount(accountId);
        available = account.available;
        break;
      case "UNI":
        accountId = apiKey.get("UNI_ACCOUNT");
        account = await aClient.getAccount(accountId);
        available = account.available;
        console.log(available);
        break;
      case "OXT":
        accountId = apiKey.get("OXT_ACCOUNT");
        account = await aClient.getAccount(accountId);
        available = account.available;
        break;
      case "VET":
        alert("CoinbasePro does not currently broker VET");
        //account = aClient.getAccount(apiKey.get("VET_ACCOUNT")).available;
        break;
    }
    return available;
  };
}

module.exports = exports = CBAuthClient;
