const express = require("express");
const http = require("http");
const app = express();
const connectDB = require("./config/database.js");
const socketio = require("socket.io");
const server = http.Server(app);
socketio(server);
const morgan = require("morgan");
const colors = require("colors");
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

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use((req, res, next) => {
  res.status(404).json({ message: "route not found" });
});
const port = process.env.PORT || 5000;
const enviroment = process.env.NODE_ENV;
connectDB();
server.listen(port, () => {
  console.log(
    `server running on port ${port} and ${enviroment} enviroment`.blue
  );
});
process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(process.exit(1));
});
