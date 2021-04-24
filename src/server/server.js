const httpProxy = require("http-proxy");
const httpProxyMiddleware = require("http-proxy-middleware");
const express = require("express");
const path = require("path");
const apiKey = require("./public/js/models/key/index.js");
const CoinbasePro = require("coinbase-pro");

const port = 3000;

const app = express();
const proxy = httpProxy.createProxyServer({});

const httpUrl = "/api-coinbase-pro";
const key = apiKey.get("COINBASE_API_KEY");
const secret = apiKey.get("COINBASE_API_SECRET");
const passphrase = apiKey.get("COINBASE_API_PASSPHRASE");
const socketUrl = apiKey.get("WEBSOCKET_URL");
const curPair = apiKey.get("CURPAIR");

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: "./views" });
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

app.use(express.static(path.join(__dirname, "public")));
/*
app.use(function (req, res) {
  delete req.headers["origin"];
  delete req.headers["referer"];
  delete req.headers["host"];

  proxy.on("proxyRes", function (proxyRes, req, res) {
    console.log(
      "Raw [target] response",
      JSON.stringify(proxyRes.headers, true, 2)
    );

    proxyRes.headers["x-reverse-proxy"] = "custom-proxy";
    proxyRes.headers["cache-control"] = "max-age=10000";

    console.log(
      "Updated [proxied] response",
      JSON.stringify(proxyRes.headers, true, 2)
    );

    // Do not use res.setHeader as they won't override headers that are already defined in proxyRes
    // res.setHeader('cache-control', 'max-age=10000');
    // res.setHeader('x-reverse-proxy', 'custom-proxy');
  });
  const apiURL = "https://api-public.sandbox.pro.coinbase.com";
  proxy.web(req, res, { target: apiURL });
});
*/
app.listen(port, () => console.log("Started proxy on port", port));

const websocket = new CoinbasePro.WebsocketClient(
  [curPair],
  "wss://ws-feed-public.pro.coinbase.com",
  {
    key: key,
    secret: secret,
    passphrase: passphrase,
  },
  { channels: ["full", "level2"] }
);
websocket.on("message", (data) => {
  /* work with data */
});
websocket.on("error", (err) => {
  /* handle error */
});
websocket.on("close", () => {
  /* ... */
});
websocket.subscribe({
  channels: [
    {
      name: "user",
      product_ids: [curPair],
    },
  ],
});
