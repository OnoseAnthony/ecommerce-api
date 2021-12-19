const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error_handler");
const cors = require("cors");
const productRouter = require("./routers/product");
const categoryRouter = require("./routers/category");
const userRouter = require("./routers/user");
const orderRouter = require("./routers/order");
require("dotenv/config");

//middlewares

//cors - start with cors
app.use(cors());
app.options("*", cors());

//env
const api = process.env.API_URL;

//json body parser
app.use(bodyParser.json());

// http request logger
app.use(morgan("tiny"));

//static dir
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// express jwt protect api
app.use(authJwt());

// express jwt protect api
app.use(errorHandler);

//user router
app.use(`${api}/users`, userRouter);

//product router
app.use(`${api}/products`, productRouter);

//category router
app.use(`${api}/categories`, categoryRouter);

//orders router
app.use(`${api}/orders`, orderRouter);

//connect to database
mongoose
  .connect(process.env.DB_CONNECTION_URL.toString(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop-db",
  })
  .then(() => {
    console.log("Database Connection success!!");
    app.listen(3000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Server not running - conection to db failed ");
  });
