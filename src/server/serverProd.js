const httpProxy = require("http-proxy");
const httpProxyMiddleware = require("http-proxy-middleware");
const express = require("express");
const path = require("path");
const apiKey = require("../public/js/models/key/index.js");
//const AuthClient = require("../public/js/models/authclient/index.js");

const port = 3000;

const app = express();
const proxy = httpProxy.createProxyServer({});

const apiProxy = httpProxyMiddleware.createProxyMiddleware({
  target: "https://api.pro.coinbase.com",
  changeOrigin: true,
  onProxyRes: (res) => {
    res.headers = {
      ...res.headers,
      "access-control-allow-headers":
        "Content-Type, cb-access-key, cb-access-sign, cb-access-timestamp, cb-access-passphrase",
    };
  },
});

app.use(express.static(path.join(__dirname, "../../dist")), apiProxy);

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: "../../dist" });
});
app.listen(port, () => console.log("Started server on port", port));

//app.listen(port, () => console.log("Started proxy on port", port));
/*
const CoinbasePro = require("coinbase-pro");

const apiURI = "https://api.pro.coinbase.com";
const key = apiKey.get("COINBASE_API_KEY");
const secret = apiKey.get("COINBASE_API_SECRET");
const passphrase = apiKey.get("COINBASE_API_PASSPHRASE");

const aClient = new CoinbasePro.AuthenticatedClient(
key,
secret,
passphrase,
apiURI
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

const {
  setIntervalAsync,
  clearIntervalAsync,
} = require("set-interval-async/dynamic");

let counter = 0;
const authorize = async () => {
  counter++;
  const accounts = await AuthClient.getAccounts();
  console.log("Authorized" + counter);
};

authorize();
/*setIntervalAsync(authorize, 1800 seconds * 1000);
*/
