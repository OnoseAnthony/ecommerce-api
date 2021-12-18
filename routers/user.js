const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");

// API'S

//Create new user
router.post(`/add`, async (req, res) => {
  if (req.body.password.length < 6)
    return res
      .status(400)
      .send("Password length cannot be less than 6 characters!!");

  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(
      req.body.password,
      process.env.SECRET_PASSWORD_SEED_PHRASE
    ),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartmentNo: req.body.apartmentNo,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zipCode,
    country: req.body.country,
  });

  newUser
    .save()
    .then((createdUser) => {
      if (!createdUser)
        return res.status(500).json({
          success: false,
          error: true,
          message: "User could not be created at this time. Try later !!",
        });
      res.status(201).json({
        message: createdUser,
        success: true,
        error: true,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: true,
        success: false,
        message: err,
      });
    });
});

//Get all users
router.get(`/`, (req, res) => {
  let userFilter = {};
  if (req.query.users) {
    userFilter = { users: req.query.users.split(",") };
  }
  User.find(userFilter)
    .select("-passwordHash")
    .then((userList) => {
      if (!userList)
        return res.status(500).json({
          error: true,
          success: false,
          message:
            "Error occurred while fetching user list. Please try again later!",
        });
      res.status(201).json({
        error: false,
        success: true,
        message: userList,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: true,
        success: false,
        message: err,
      });
    });
});

//Get single user by id
router.get(`/:userId`, (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send("User Id is not valid!!");

  User.findById(userId)
    .select("-passwordHash")
    .then((user) => {
      if (!user)
        return res.status(500).json({
          error: true,
          success: false,
          message:
            "An error occurred while fetching user. please try again later!!",
        });
      res.status(201).json({ error: false, success: true, message: user });
    })
    .catch((err) =>
      res.status(400).json({ error: true, success: false, message: err })
    );
});

//Get total number of users - statistics
router.get(`/get/count`, (req, res) => {
  User.countDocuments({})
    .then((userCount) => {
      if (!userCount)
        return res.status(500).json({
          error: true,
          success: false,
          message: "Error occurred while fetching user count!!",
        });
      res.status(201).json({
        error: false,
        success: true,
        message: { userCount: userCount },
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: true,
        success: false,
        message: err,
      });
    });
});

//Get all admin users
router.get(`/get/admin`, (req, res) => {
  User.find({})
    .then((adminList) => {
      if (!adminList)
        return res.status(500).json({
          message: "No User with Admin privileges found !!",
          success: false,
          error: true,
        });

      res.status(201).json({
        message: productList,
        success: true,
        error: false,
      });
    })
    .catch((err) => {
      res.status(400).json({
        err: err,
        success: false,
        error: true,
      });
    });
});

//update user by id
router.put(`/:userId`, (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send("User Id is not valid!!");

  User.findByIdAndUpdate(
    userId,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      apartmentNo: req.body.apartmentNo,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      country: req.body.country,
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser)
        return res.status(500).json({
          error: true,
          success: false,
          message: "Error occurred while updating user !!",
        });
      res.status(201).json({
        error: false,
        success: true,
        message: updatedUser,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: true,
        success: false,
        message: err,
      });
    });
});

//delete a user by id
router.delete(`/:id`, (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send("Invalid User Id !!");
  }

  User.findByIdAndRemove(userId)
    .then((user) => {
      if (user) {
        return res.status(201).json({
          message: "user deleted successfully",
          success: true,
          error: false,
        });
      } else {
        return res.status(500).json({
          message: "user not found",
          success: false,
          error: true,
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: err,
        success: false,
        error: true,
      });
    });
});

router.post(`/login`, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Email does not exist!!");

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.SECRET_JWT_SEED_PHRASE,
      { expiresIn: "1d" }
    );
    return res.status(201).json({
      error: false,
      success: true,
      message: { user: user.email, token: token },
    });
  } else {
    res.status(400).send("Incorrect Password");
  }
});

module.exports = router;
