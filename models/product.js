const mongoose = require("mongoose");

//SCHEMAS
const productSchema = mongoose.Schema({
  name: String,
  imageUrl: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

//MODELS
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
