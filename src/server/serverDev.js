const httpProxy = require("http-proxy");
const httpProxyMiddleware = require("http-proxy-middleware");
const express = require("express");
const path = require("path");
const apiKey = require("../public/js/models/key/index.js");

const port = 3000;

const app = express();
const proxy = httpProxy.createProxyServer({});

const httpUrl = "/api-coinbase-pro";

console.log(path.join(__dirname, "../public"));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/html/index.html"));
});

app.listen(port, () => console.log("Started proxy on port", port));

/*
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
*/
