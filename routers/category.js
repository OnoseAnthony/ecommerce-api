const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

// API'S

//Create new category
router.post(`/add`, (req, res) => {
  const newCategory = new Category({
    name: req.body.name,
    icon: req.body.icon,
    imageUrl: req.body.imageUrl,
    color: req.body.color,
  });

  newCategory
    .save()
    .then((createdCategory) => {
      res.status(201).json(createdCategory);
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
        success: false,
      });
    });
});

//Get all categories
router.get(`/`, (req, res) => {
  Category.find({})
    .then((categoryList) => {
      res.status(201).json(categoryList);
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
        success: false,
      });
    });
});

//Get category by id
router.get(`/:categoryId`, (req, res) => {
  Category.findById(req.params.categoryId)
    .then((category) => {
      res.status(201).json(category);
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
        success: false,
      });
    });
});

//update category by id
router.put(`/:categoryId`, (req, res) => {
  Category.findByIdAndUpdate(
    req.params.categoryId,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      imageUrl: req.body.imageUrl,
    },
    { new: true }
  )
    .then((category) => {
      res.status(201).json(category);
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
        success: false,
      });
    });
});

//Delete a category by id
router.delete(`/delete/:categoryId`, (req, res) => {
  Category.findByIdAndRemove(req.params.categoryId)
    .then((category) => {
      if (category) {
        return res.status(201).json({
          message: "category deleted successfully",
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "category not found",
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

module.exports = router;
