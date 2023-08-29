import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import cookieSession from "cookie-session";
import { Server } from "socket.io";

// https://stackoverflow.com/a/57527735
// will catch async errors and pass to error middleware without try/catch blocks
import "express-async-errors";

// passport setup
import passport from "./src/passport.js";

// api routes
import api from "./src/api.js";

// initialize app, ejs, and socket.io
const app = express();
app.set("view engine", "ejs");
const server = http.createServer(app);
const io = new Server(server);

// custom auth middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// load middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// passes io object to routers
app.use((req, res, next) => {
  res.io = io;
  return next();
});

// cookie session
app.use(
  cookieSession({
    name: "session",
    keys: ["key1key1", "key2key2"],
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  })
);

// passport init
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(express.static("public"));

app.get("/login", (req, res) => {
  res.render("login", { user: "none" });
});

// local auth
app.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// behind authentication
app.use(ensureAuthenticated);

app.get("/", (req, res) => {
  res.render("board", { user: req.user });
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

// start server
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`listening on ${port}`);
});
