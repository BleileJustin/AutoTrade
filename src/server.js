const httpProxy = require("http-proxy-middleware");
const express = require("express");
const path = require("path");

const app = express();

app.use(
  "/api-coinbase-pro",
  httpProxy.createProxyMiddleware({
    target: "https://api.pro.coinbase.com",
    changeOrigin: true,
    pathRewrite: {
      [`^/api-coinbase-pro`]: "",
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.sendFile("index.html", { root: "./views" });
});

app.listen(3000);
