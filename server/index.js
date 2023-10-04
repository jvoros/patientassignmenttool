import express from "express"
import api from "./api.js";

const server = express();
server.set("view engine", "ejs");

server.use(express.json());

server.get("/", (req, res) => {
  res.json({ message: 'Hello World!' });
});

server.use("/api", api);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`listening on ${port}`);
});