import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
// https://stackoverflow.com/a/57527735
// will catch async errors and pass to error middleware without try/catch blocks
import "express-async-errors";
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
app.set("view engine", "ejs");
app.set("views", "./client");
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// WEBSOCKET
const server = createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("SOCKET.IO: a user connected");
  console.log("SOCKET.IO: emitting new state");
  socket.emit("new state", board.getState());
});
// middleware that passes io object to routers, so io is available on res object
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

// ROUTES OUTSIDE AUTH

app.use(express.static("client/public"));

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login/password", (req, res) => {
  const { password } = req.body;
  if (password === userTable["nurse"].pass) {
    const user = { username: "nurse" };
    const token = jwt.sign(user, JWT_KEY);

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24, // one day
    });
    res.status(200);
    res.redirect("/");
    res.io.emit("new state", board.getState());
    return;
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
