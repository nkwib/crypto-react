import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import Socket from "./utils/socket.js";
import {connect} from "./config/db.js";
import cryptoRoutes, {startPolling} from "./routes/crypto.js";

const app = express()
const server = http.createServer(app);

// allow from localhost
app.use(cors(
  {
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"]
  }
));

app
  .use(express.json())
  .use(express.static("public"))
  .use(express.urlencoded({ extended: true }))
  .use("/", cryptoRoutes)

connect();
startPolling(1000 * 60 * 5);

Socket.init(server);

server.listen(3001, () => {
  console.log("listening on " + 3001);
});
