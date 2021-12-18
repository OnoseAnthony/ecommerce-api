const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Order } = require("../models/order");
const { OrderItem } = require("../models/order_item");
const { User } = require("../models/user");
require("dotenv/config");

//create a new order
router.post(`/add`, async (req, res) => {
  const user = await User.findById(req.body.user);
  if (!user) return res.status(400).send("User does not exist");

  // get the ids of all the items the user wants to purchase
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderItemsIdresolved = await orderItemsIds;
  const totalOrderAmount = await Promise.all(
    orderItemsIdresolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalpriceResolved = totalOrderAmount.reduce((a, b) => a + b, 0);
  let newOrder = new Order({
    user: req.body.user,
    orderItems: orderItemsIdresolved,
    orderPrice: totalpriceResolved,
    orderStatus: req.body.orderStatus,
    phone: req.body.phone,
    shippingAddress: req.body.shippingAddress,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zipCode,
    country: req.body.country,
  });

  newOrder = await newOrder.save();

  if (!newOrder) return res.status(400).send("Order cannot be created");

  res.send(newOrder);
});

//get all order
router.get(`/`, async (req, res) => {
  const orderlist = await Order.find()
    .populate("user", "email")
    .populate("orderItems")
    .sort("orderDate");

  if (!orderlist)
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error occurred while fetching products. Try later!",
    });

  res.status(201).json({ success: true, error: false, message: orderlist });
});

//get all pending orders
router.get(`/get/pending`, async (req, res) => {
  const orderlist = await Order.find({ orderStatus: "pending" })
    .populate("user", "email")
    .populate({ path: "orderItems", populate: "product" })
    .sort("orderDate");

  if (!orderlist)
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error occurred while fetching orders. Try later!",
    });

  res.status(201).json({ success: true, error: false, message: orderlist });
});

//get orders by id
router.get(`/:orderId`, async (req, res) => {
  const orderId = req.params.orderId;
  if (!mongoose.isValidObjectId(orderId))
    return res.status(400).send("Invalid Order Id");

  const order = await Order.findById(orderId)
    .populate("user", "email")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort("orderDate");

  if (!order)
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error occurred while fetching order. Try later!",
    });

  res.status(201).json({ success: true, error: false, message: order });
});

//get all orders for a user
router.get(`/get/userorders/:userId`, async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send("Invalid User Id");

  const user = await User.findOne({ id: userId });
  if (!user) return res.status(400).send("User does not exist!!");

  const orderList = await Order.find({ user: userId })
    .populate("user", "email")
    .populate({
      path: "orderItems",
      populate: "product",
    })
    .sort("orderDate");

  if (!orderList)
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error occurred while fetching user pending orders. Try later!",
    });

  res.status(201).json({ success: true, error: false, message: orderList });
});

//get pending orders for a user
router.get(`/get/pending/:userId`, async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send("Invalid User Id");

  const user = await User.findOne({ id: userId });
  if (!user) return res.status(400).send("User does not exist!!");

  const orderList = await Order.find({ user: userId, orderStatus: "pending" })
    .populate("user", "email")
    .populate({
      path: "orderItems",
      populate: "product",
    })
    .sort("orderDate");

  if (!orderList)
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error occurred while fetching user pending orders. Try later!",
    });

  res.status(201).json({ success: true, error: false, message: orderList });
});

//get orders count - statistics for admin backend
router.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments({});

  if (!orderCount) {
    return res.status(500).json({
      error: true,
      success: false,
      message: "Error occurred while fetching user count!!",
    });
  }

  res.status(201).json({
    error: false,
    success: true,
    message: { orderCount: orderCount },
  });
});

//get orders count for a user by id
router.get(`/get/count/:userId`, async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send("Invalid User Id");

  const user = await User.findOne({ id: userId });
  if (!user) return res.status(400).send("User does not exist!!");

  const orderCount = await Order.countDocuments({ user: userId });

  if (!orderCount) {
    return res.status(500).json({
      error: orderCount === 0 ? false : true,
      success: orderCount === 0 ? true : false,
      message:
        orderCount === 0 ? 0 : "Error occurred while fetching user count!!",
    });
  }

  res.status(201).json({
    error: false,
    success: true,
    message: { orderCount: orderCount },
  });
});

//get total sales
router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$orderPrice" } } },
  ]);

  if (!totalSales)
    return res.status(400).json({
      error: true,
      success: false,
      message: "Sales total cannot be generated. Try later!!",
    });

  res.status(201).json({
    error: false,
    success: true,
    message: {
      total: totalSales.pop().totalSales,
    },
  });
});

//update order
router.put(`/:orderId`, async (req, res) => {
  const orderId = req.params.orderId;
  if (!mongoose.isValidObjectId(orderId))
    return res.status(400).send("Invalid Order Id");

  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: req.body.orderStatus },
    { new: true }
  );

  if (!order)
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error occurred while updating order. Try later!",
    });

  res.status(201).json({ success: true, error: false, message: order });
});

//delete order
router.delete(`/:orderId`, async (req, res) => {
  const orderId = req.params.orderId;
  if (!mongoose.isValidObjectId(orderId))
    return res.status(400).send("Invalid Order Id");

  const order = await Order.findByIdAndRemove(orderId, {
    orderStatus: req.body.orderStatus,
  });

  if (!order)
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error occurred while deleting order. Try later!",
    });

  await order.orderItems.map(async (orderItem) => {
    await OrderItem.findByIdAndRemove(orderItem);
  });

  res.status(201).json({
    success: true,
    error: false,
    message: "Order deleted successfully",
  });
});

module.exports = router;
