const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// API'S

//Get all products
router.get(`/`, (req, res) => {
  Product.find({})
    .then((productList) => {
      res.status(201).json(productList);
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
        success: false,
      });
    });
});

//Create new product
router.post(`/add`, (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    countInStock: req.body.countInStock,
  });

  newProduct
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

module.exports = router;
