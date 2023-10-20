import * as dotenv from "dotenv";
dotenv.config();
import express from "express"
import cors from "cors"
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import api from "./api.js";

const JWT_KEY = process.env.JWT_KEY;

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

// response helper
function message(status, text, payload = '') {
  return {
    status,
    text,
    payload
  }
}

// custom authorization middlewares
const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json(message('error', 'Unauthorized Request'));
  }
  try {
    const data = jwt.verify(token, JWT_KEY);
    req.user= data;
    return next();
  } catch {
    return res.status(401).json(message('error', 'Unauthorized Request'));
  }
};

app.get("/", (_req, res) => {
  res.json({ message: 'Hello World!' });
});

const userTable = {
  'nurse': { pass: process.env.NURSE_PASSWORD, role: "nurse" },
  'doctor': { pass: process.env.DOC_PASSWORD, role: "doctor" },
};

app.post("/api/login", (req, res) => {
  const { role, password } = req.body;
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

app.post('/api/checklogin', (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(200).json(message('success', 'Not logged in yet.'));
  }
  try {
    const user = jwt.verify(token, JWT_KEY);
    return res.status(200).json(message('success', 'Already logged in', user));
  } catch {
    return res.status(200).json(message('success', 'Invalid token'));
  }
});

app.post('/api/logout', (_req, res) => {
  res.clearCookie('access_token');
  res.status(200).json(message('success', 'Logged Out'));
});

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