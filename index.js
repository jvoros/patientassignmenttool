import "dotenv/config";
import express from "express";
// import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
// https://stackoverflow.com/a/57527735
// will catch async errors and pass to error middleware without try/catch blocks
import "express-async-errors";
import nunjucks from "nunjucks";
import createBoardStore from "./server/controllers/board.js";

import api from "./server/api.js";
const JWT_KEY = process.env.JWT_KEY;
export const board = createBoardStore();

// HELPERS
// response helper
function message(status, text, payload = "") {
  return {
    status,
    text,
    payload,
  };
}

// SETUP
const app = express();
app.set("view engine", "html");
app.use(express.json());
// app.use(cors());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
); // for login form
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

// WEBSOCKET
const server = createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("SOCKET.IO: a user connected");
});
// passes io object to routers
app.use((_req, res, next) => {
  res.io = io;
  return next();
});

// AUTH MIDDLEWARE
const userTable = {
  nurse: { pass: process.env.NURSE_PASSWORD, username: "nurse" },
  doctor: { pass: process.env.DOC_PASSWORD, username: "doctor" },
};

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const data = jwt.verify(token, JWT_KEY);
    req.user = data;
    return next();
  } catch {
    return res.redirect("/login");
  }
};

// ROUTES

app.use(express.static("public"));

app.get("/login", (req, res) => {
  res.render("login", {
    user: "none",
    message: !req.session.message ? "no message" : req.session.message[0],
  });
});

// local auth
app.post("/login/password", (req, res) => {
  const { username, password } = req.body;
  if (password === userTable[username].pass) {
    const user = { username };
    const token = jwt.sign(user, JWT_KEY);

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24, // one day
    });
    res.status(200);
    res.io.emit("new state", board.getSortedState());
    res.redirect("/");
  } else {
    return res.redirect("/login");
  }
});

app.post("/checklogin", (req, res) => {
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

// ROUTES BEHIND AUTH
app.use(authorization);

app.get("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/login");
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/api", api);

// ERROR HANDLING
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

// LAUNCH
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`listening on ${port}`);
});
