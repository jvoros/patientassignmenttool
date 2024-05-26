import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { createServer } from "http";
// https://stackoverflow.com/a/57527735
// will catch async errors and pass to error middleware without try/catch blocks
import "express-async-errors";
import { createClient } from "@supabase/supabase-js";

const JWT_KEY = process.env.JWT_KEY;

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

// SUPABASE
const supabase = createClient(
  "http://localhost:54321",
  process.env.SUPABASE_API
);

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

app.get("/login", async (_req, res) => {
  const { data, error } = await supabase.from("sites").select("site_id, name");
  res.render("login", { sites: data });
});

app.post("/login/password", async (req, res) => {
  const { site_id, password } = req.body;
  const { data, error } = await supabase
    .from("sites")
    .select("name, access_code")
    .eq("site_id", site_id);
  if (password === data[0].access_code) {
    const user = { username: data[0].name };
    const token = jwt.sign(user, JWT_KEY);

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24, // one day
    });
    res.status(200);
    res.redirect("/");
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

app.get("/logout", (_req, res) => {
  res.clearCookie("access_token");
  res.redirect("/login");
});

app.get("/", (_req, res) => {
  res.render("home");
});

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
createServer(app).listen(port, () => {
  console.log(`listening on ${port}`);
});
