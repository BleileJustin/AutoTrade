const mongoose = require("mongoose");
const { Schema } = require("mongoose");

//Data Model for Price object
const OrderSchema = new Schema({
  type: {
    type: String,
    enum: ["done"],
    required: true
  },
  side: {
    type: String,
    enum: ["sell", "buy"],
    required: true
  },
  id: {
    type: String,
    enum: ["BTC-USD"],
    required: true
  },
  price: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
