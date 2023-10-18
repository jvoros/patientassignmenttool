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

function message(type, text, payload = '') {
  return {
    type,
    text,
    payload
  }
}


app.get("/", (req, res) => {
  res.json({ message: 'Hello World!' });
});

const userTable = {
  'nurse': { pass: '7800', role: "nurse" },
  'doctor': { pass: 'epgrocks', role: "doctor" },
};

app.post("/api/login", (req, res) => {
  const { role, password } = req.body;
  console.log(userTable[role])
  if (password === userTable[role].pass) {
    const user = { role }
    const token = jwt.sign(user, JWT_KEY);
    
    res.cookie("access_token", token, { 
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 1000*60*60*24 // one day
    });

    res.status(200).json(message('success', 'Logged In', user));
  
  } else {
    res.status(401).json(message('unauthorized', 'Incorrect password'));
  }
});

app.post('/api/test', (req, res) => {
  res.json(req.cookies);
});

// custom authorization middlewares
const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized Request' });
  }
  try {
    const data = jwt.verify(token, JWT_KEY);
    req.role = data.role;
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized Request' });
  }
};

// api routes, protected by middleware
app.use(authorization);

app.post("/api/testauth", (req, res) => {
  res.json({  role: req.role });
});

app.use("/api", api);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});