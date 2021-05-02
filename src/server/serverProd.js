const httpProxy = require("http-proxy");
const httpProxyMiddleware = require("http-proxy-middleware");
const express = require("express");
const path = require("path");
const apiKey = require("../public/js/models/key/index.js");

const {
  setIntervalAsync,
  clearIntervalAsync,
} = require("set-interval-async/dynamic");

const AuthClient = require("../public/js/models/authclient/index.js");
const Socket = require("./socket.js");

const port = 3000;

const app = express();
const proxy = httpProxy.createProxyServer({});

const httpUrl = "/api-coinbase-pro";

//const webSocket = new Socket("BTC_USD");
//webSocket.start();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  "/api-coinbase-pro",
  httpProxyMiddleware.createProxyMiddleware({
    target: "https://api.pro.coinbase.com",
    changeOrigin: true,
    pathRewrite: {
      [`^/api-coinbase-pro`]: "",
    },
  })
);

app.use(express.static(path.join(__dirname, "../../dist")));

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: "../../dist" });
});

app.listen(port, () => console.log("Started proxy on port", port));

const authorize = async () => {
  const accounts = await AuthClient.getAccounts();
  console.log("Authorized");
};

authorize();
//setIntervalAsync(authorize, 1800 /*seconds*/ * 1000);
