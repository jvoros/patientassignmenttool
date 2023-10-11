import * as dotenv from "dotenv";
dotenv.config();
import express from "express"
import cors from "cors";

import api from "./api.js";

const app = express();
app.set("view engine", "ejs");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.post("/login", (req, res) => {
  console.log('/login endpoint hit');
  res.header("Content-Type",'application/json');
  res.json({ "message": 'Hey Dude' });
});

app.use("/api", api);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});