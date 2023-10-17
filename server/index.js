import * as dotenv from "dotenv";
dotenv.config();
import express from "express"
import cors from "cors"
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import api from "./api.js";

const JWT_KEY = 'dN0qDHOE6yat54Y505f4TYaprM9qEa2t';

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.post("/login", (req, res) => {
  const { role, password } = req.body;
  if (role === 'nurse' && password === '7800') {
    const user = {
      role: 'nurse'
    }
    const token = jwt.sign(user, JWT_KEY);
    res.cookie("access_token", token, { 
      httpOnly: true,
      maxAge: 1000*60*60*24 // one day
    });
    res.status(200);
    res.json({ token, user });
  } else if (role === 'doctor' && password === 'epgrocks') {
    res.status(200);
    res.json({ message: 'Success'});
  } else {
    res.status(401);
    res.json({ message: 'Unauthorized'});
  }
});

app.use("/api", api);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});