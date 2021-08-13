const express = require("express");
const http = require("http");
const app = express();
const connectDB = require("./config/database.js");
const socketio = require("socket.io");
const server = http.Server(app);
socketio(server);
const colors = require("colors");
const errorWare = require("./middlewares/error.js");
const router = require("./router/router.js");
const { config } = require("dotenv");

config({ path: ".env" });
if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}
app.use("/api/v1", router);
app.use(errorWare);
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
