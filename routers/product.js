const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-").split(".")[0];
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// API'S

//Create new product
router.post(`/add`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Category does not exist");

  const file = req.file;
  if (!file) return res.status(400).send("Image is required!!");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const newProduct = new Product({
    name: req.body.name,
    imageUrl: `${basePath}${fileName}`,
    countInStock: req.body.countInStock,
    shortDescription: req.body.shortDescription,
    category: req.body.category,
    price: req.body.price,
    isFeatured: req.body.isFeatured,
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

//Get all products
router.get(`/`, (req, res) => {
  let filter = {};

  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  Product.find(filter)
    .populate("category")
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

//Get a single product
router.get(`/:productId`, (req, res) => {
  Product.findById(req.params.productId)
    .populate("category")
    .then((product) => {
      res.status(201).json(product);
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
        success: false,
      });
    });
});

//update product by id
router.put(`/:productId`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.productId))
    return res.status(400).send("Invalid Product Id");

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Category does not exist");

  Product.findByIdAndUpdate(
    req.params.productId,
    {
      name: req.body.name,
      imageUrl: req.body.imageUrl,
      countInStock: req.body.countInStock,
      shortDescription: req.body.shortDescription,
      category: req.body.category,
      price: req.body.price,
    },
    { new: true }
  )
    .then((product) => {
      if (!product)
        return res.status(201).json({
          error: true,
          message: "Product does not exist",
        });

      res.status(201).json(product);
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
        success: false,
      });
    });
});

// add multiple images
router.put(
  "/gallery-images/:productId",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.productId))
      return res.status(400).send("Invalid Id");

    const files = req.files;
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagePaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagePaths,
      },
      {
        new: true,
      }
    );

    if (!product)
      return res.status(500).send("the gallery cannot be updated!!");

    res.status(201).json({
      error: false,
      success: true,
      messages: product,
    });
  }
);

//Delete a product by id
router.delete(`/delete/:productId`, (req, res) => {
  Product.findByIdAndRemove(req.params.productId)
    .then((product) => {
      if (product) {
        return res.status(201).json({
          message: "product deleted successfully",
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "product not found",
          success: true,
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        error: err,
        success: false,
      });
    });
});

// get product count
router.get(`/get/count`, (req, res) => {
  const count = Product.countDocuments((count) => count);

  if (!count)
    return res
      .status(500)
      .json({ error: "Internal Server Error", success: false });

  res.status(201).json({
    productCount: count,
  });
});

// get featured product
router.get(`/get/featured/:count`, (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  Product.find({ isFeatured: true })
    .limit(+count)
    .then((productList) => {
      if (!productList)
        return res.status(400).json({
          message: "No Featured Product Available",
          success: false,
        });

      res.status(201).json({
        products: productList,
        success: true,
      });
    })
    .catch((err) => {
      res.status(400).json({
        err: err,
        success: false,
      });
    });
});

module.exports = router;
