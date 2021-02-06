## Note: Unreleased/In Development

# AutoTrade

### A Personal Cryptocurrency Trading Bot using price data from the [CoinBase-Pro](https://www.npmjs.com/package/coinbase-pro) npm package and Bollinger Bands from the [technicalindicators](https://www.npmjs.com/package/technicalindicators) npm package to autonomously make buy and sell decisions on a live market.

# Install:

To download the project and tinker with it on your own, clone the repository using

`git clone https://github.com/BleileJustin/AutoTrade.git`

You'll need to download the dependencies so navigate into the cloned repo on your machine and use

`sudo npm i -g`

Now the project wont have authentication to the Coinbase api or the MongoDB database without a config.json
The currenct path to the needed config.json is outside the AutoTrade folder. So if you have the AutoTrade folder on your desktop, make the config.json there as well using

`touch config.json`

Open the config.json in your preferred text editor
The format for the config.json is as such,

```
{
  "COINBASE_API_KEY": "",
  "COINBASE_API_SECRET": "",
  "COINBASE_API_PASSPHRASE": "",
  "MONGO_URL": "mongodb://USERNAME:PASSWORD@SERVERIP:HOST/DATABASE_NAME",
  "MONGO_DATABASE_NAME": "DATABASE_NAME"
}
```

Use a [CoinbasePro](https://pro.coinbase.com/) account to create and API key which will give you what you need to put into the quotes

At that point you can run the program by navigating back into the AutoTrade folder and running

`node index.js`

# Next Steps

The current stage of development is tuning the Bollinger Bands until they are ready to send trade signals needed for the bot to know when to buy and sell for profit.
Will later add full GUI interaction to visibly see when the bot has traded and how much profit it has made along with other data on your market position.
