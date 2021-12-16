const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const productRouter = require("./routers/product");
const categoryRouter = require("./routers/category");
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

//product router
app.use(`${api}/products`, productRouter);

//category router
app.use(`${api}/category`, categoryRouter);

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
