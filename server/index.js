const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "local"}`,
});

console.log(`.env.${process.env.NODE_ENV || "local"}`);
// Setup Mongoose connection
console.log(process.env.MONGO_URL)
require("./config/db")(process.env.MONGO_URL);


// Entry route
const indexRoutes = require("./controllers/index.route");


const app = express();

// middlewares
app.enable("trust proxy")
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



//Load all routes
app.use("/api/v1", indexRoutes);

// All undefined routes should throw 404
app.use("*", (req, res, next) => {
  const error = new Error("not found");
  error.statusCode = 404;
  next(error);
});

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Listening on port ${port}....`);
});
