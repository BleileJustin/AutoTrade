//Dependencies
const BB = require("technicalindicators").BollingerBands;
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

//Data Model for Price object
const PriceSchema = new Schema({
  base: {
    type: String,
    enum: ["BTC"],
    required: true,
  },
  currency: {
    type: String,
    enum: ["USD", "GBP", "EUR"],
    required: true,
  },
  bid: {
    type: Number,
    required: true,
  },
  ask: {
    type: Number,
    required: true,
  },
  spot: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Price = mongoose.model("Price", PriceSchema);

module.exports = Price;
