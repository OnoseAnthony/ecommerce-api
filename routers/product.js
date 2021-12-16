const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");

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
router.post(`/add`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Category does not exist");

  const newProduct = new Product({
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    countInStock: req.body.countInStock,
    shortDescription: req.body.shortDescription,
    category: req.body.category,
    price: req.body.price,
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
