const httpProxy = require("http-proxy");
const httpProxyMiddleware = require("http-proxy-middleware");
const express = require("express");
const path = require("path");
const apiKey = require("../public/js/models/key/index.js");
const CoinbasePro = require("coinbase-pro");

const port = 3000;

const app = express();
const proxy = httpProxy.createProxyServer({});

const httpUrl = "/api-coinbase-pro";

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

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: "src/public/html" });
});

app.listen(port, () => console.log("Started proxy on port", port));
