import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
// https://stackoverflow.com/a/57527735
// will catch async errors and pass to error middleware without try/catch blocks
import "express-async-errors";

import api from "./api.js";

const JWT_KEY = process.env.JWT_KEY;

// setup
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("SOCKET.IO: a user connected");
});

// HELPERS
function getPath(p) {
  return new URL(p, import.meta.url).pathname;
}

// response helper
function message(status, text, payload = "") {
  return {
    status,
    text,
    payload,
  };
}

// custom authorization middlewares
const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json(message("error", "Unauthorized Request"));
  }
  try {
    const data = jwt.verify(token, JWT_KEY);
    req.user = data;
    return next();
  } catch {
    return res.status(401).json(message("error", "Unauthorized Request"));
  }
};

// passes io object to routers
app.use((_req, res, next) => {
  res.io = io;
  return next();
});

app.use("/assets", express.static(getPath("../client/dist/assets")));

app.get("/", (_req, res) => {
  res.sendFile(getPath("../client/dist/index.html"));
});

app.post("/test", (req, res) => {
  res.json(req.body);
});

const userTable = {
  nurse: { pass: process.env.NURSE_PASSWORD, role: "nurse" },
  doctor: { pass: process.env.DOC_PASSWORD, role: "doctor" },
};

app.post("/api/login", (req, res) => {
  const { role, password } = req.body;
  if (password === userTable[role].pass) {
    const user = { role };
    const token = jwt.sign(user, JWT_KEY);

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24, // one day
    });
    res.status(200).json(message("success", "Logged In", user));
  } else {
    res.status(401).json(message("unauthorized", "Incorrect password"));
  }
});

app.post("/api/checklogin", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(200).json(message("success", "Not logged in yet."));
  }
  try {
    const user = jwt.verify(token, JWT_KEY);
    return res.status(200).json(message("success", "Already logged in", user));
  } catch {
    return res.status(200).json(message("success", "Invalid token"));
  }
});

app.post("/api/logout", (_req, res) => {
  res.clearCookie("access_token");
  res.status(200).json(message("success", "Logged Out"));
});

// api routes, protected by middleware
app.use(authorization);

app.use("/api", api);

// error handling
// comes after routes so it can catch any errors they throw
app.use(function (err, req, res, next) {
  // catches the error message from db functions
  // https://stackoverflow.com/a/44078785
  res.status(500).json({
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    message: err.message,
  });
  return next();
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`listening on ${port}`);
});
