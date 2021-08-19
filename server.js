const connectDB = require("./config/database.js");
const socketio = require("socket.io");
const app = require("./appServer");
const colors = require("colors");
const http = require("http");
const server = http.Server(app);
socketio(server);

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
