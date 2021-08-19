const express = require("express");

const app = express();
const morgan = require("morgan");
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const errorWare = require("./middlewares/error.js");
const router = require("./router/router.js");
const { config } = require("dotenv");
const customError = require("./helpers/customErrorResponse.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
config({ path: ".env" });
app.use(bodyParser.json());

app.use("/api/v1", router);
app.use(errorWare);
app.use((req, res, next) => {
  res.status(404).json({ message: "route not found" });
});
module.exports = app;
