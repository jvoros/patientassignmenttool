import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import { createServer } from "http";
import { Server } from "socket.io";
// https://stackoverflow.com/a/57527735
// will catch async errors and pass to error middleware without try/catch blocks
import "express-async-errors";
import nunjucks from "nunjucks";

import passport from "./server/passport.js";
import createBoardStore from "./server/controllers/board.js";
import api from "./server/api.js";

// SETUP
export const board = createBoardStore();
const app = express();
app.set("view engine", "html");
app.use(express.json());
app.use(cors());
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

// PASSPORT
app.use(
  cookieSession({
    name: "session",
    keys: ["key1key1", "key2key2"],
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  })
);
app.use(passport.initialize());
app.use(passport.session());

// HELPERS
export function getPath(p) {
  return new URL(p, import.meta.url).pathname;
}

export function responder(res) {
  // client browser needs a response to know transmission complete
  res.status(200).json({ message: "success" });
  // state payload sent to client by socket.io
  res.io.emit("new state", board.getSortedState());
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
// const authorization = (req, res, next) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     return res.status(401).json(message("error", "Unauthorized Request"));
//   }
//   try {
//     const data = jwt.verify(token, JWT_KEY);
//     req.user = data;
//     return next();
//   } catch {
//     return res.status(401).json(message("error", "Unauthorized Request"));
//   }
// };

// AUTH MIDDLEWARE
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// ROUTES
// app.use("/assets", express.static(getPath("../client/dist/assets")));
app.use(express.static("public"));

app.get("/login", (req, res) => {
  res.render("login", {
    user: "none",
    message: !req.session.message ? "no message" : req.session.message[0],
  });
});

// local auth
app.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    console.log(req.body);
  }
);

// const userTable = {
//   nurse: { pass: process.env.NURSE_PASSWORD, role: "nurse" },
//   doctor: { pass: process.env.DOC_PASSWORD, role: "doctor" },
// };

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
    res.io.emit("new state", board.getSortedState());
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

// ROUTES BEHIND AUTH
app.use(ensureAuthenticated);

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

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
