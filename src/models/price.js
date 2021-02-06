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

//Price methods

PriceSchema.statics.getBollinger = async ({
  range,
  start,
  period,
  end = Date(),
} = {}) => {
  const time = range.length - period;
  const input = {
    period: period,
    values: range,
    stdDev: 2,
  };
  const fullBB = BB.calculate(input);
  return fullBB; //[fullBB.length - 1];
};

const Price = mongoose.model("Price", PriceSchema);

module.exports = Price;
