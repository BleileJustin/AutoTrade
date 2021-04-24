const apiKey = require("../key/index.js");
const CoinbasePro = require("coinbase-pro");

const httpUrl = "/api-coinbase-pro";
const key = apiKey.get("COINBASE_API_KEY");
const secret = apiKey.get("COINBASE_API_SECRET");
const passphrase = apiKey.get("COINBASE_API_PASSPHRASE");
const socketUrl = apiKey.get("WEBSOCKET_URL");
const sandboxURI = "https://api.pro.coinbase.com";
const useSandbox = false;

const aClient = new CoinbasePro.AuthenticatedClient(
  httpUrl,
  key,
  secret,
  passphrase,
  useSandbox
);

module.exports = {
  placeOrder: async (params) => {
    const order = aClient.placeOrder(params);
    return order;
  },
  getAccount: async (id) => {
    const account = await aClient.getAccount(id);
    console.log(account);
    return account;
  },
  getAccounts: async () => {
    const accounts = await aClient.getAccounts();
    console.log(accounts);
  },
};