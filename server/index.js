import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import Socket from "./utils/socket.js";
import {connect} from "./config/db.js";
import cryptoRoutes, {startPolling} from "./routes/crypto.js";
const PORT = process.env.PORT || 8080;

const pollingMinutes = process.env.POLLING_MINUTES || 5;

const app = express()
const server = http.createServer(app);

// allow from localhost
app.use(cors(
  {
    // origin will be set properly in staging and production. These are just mocking real settings
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"]
  }
));

app
  .use(express.json())
  .use(express.static("public"))
  .use(express.urlencoded({ extended: true }))
  // all the routes are on one file because the app is really small
  // .use("/something", somethingRoutes)
  // .use("/somethingelse", somethingElseRoutes)
  .use("/", cryptoRoutes)

connect();

// Socket is initialized separated from index.js
Socket.init(server);

// Testing purpose
// setInterval(() => {
//   Socket.emit("msg", {type: "test"});
// }, 1000);

server.listen(PORT, () => {
  console.log("listening on " + PORT);
  
  // this is where prices are updated, pollingMinutes is the variable to adjust
  startPolling(1000 * 60 * pollingMinutes);
});
