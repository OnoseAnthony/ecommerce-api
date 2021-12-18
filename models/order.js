const mongoose = require("mongoose");

// SCHEMA
const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  orderPrice: {
    type: Number,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "pending",
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  shippingAddress2: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  zipCode: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  orderDate: {
    type: Date,
    default: Date.now(),
  },
});

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

// MODEL
exports.Order = mongoose.mongoose.mongoose("Orders", orderSchema);
