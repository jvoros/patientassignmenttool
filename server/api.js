import express from "express";

import createBoardStore from "./controllers/board.js";

const api = express.Router();

const board = createBoardStore();

// HELPERS
function getPath(p) {
  return new URL(p, import.meta.url).pathname;
}

function responder(res) {
  // client browser needs a response to know transmission complete
  res.json({ message: "success" });
  // state payload sent to client by socket.io
  res.io.emit("new state", board.getState());
}

// MIDDLEWARE
// if 'nurse' then admin actions at bottom
const confirmRole = (requiredRole) => (req, res, next) => {
  if (!req.user.role || req.user.role !== requiredRole) {
    return res.status(401).json({ message: "Unauthorized Request" });
  }
  return next();
};

// MAIN API
api.get("/board", (_req, res) => {
  responder(res);
});

api.get("/history", (req, res) => {
  res.json(history.getState());
});

api.post("/doctors", async (req, res) => {
  res.sendFile(getPath("./json/doctors.json"));
});

api.post("/shifts", async (req, res) => {
  res.sendFile(getPath("./json/shift_details.json"));
});

api.post("/addShift", (req, res) => {
  const { doctor, options } = req.body;

  board.addNewShift(doctor, options);
  res.json(board.getState());
});

// PROTECTED ADMIN ACTIONS
api.use(confirmRole("nurse"));

api.get("/backintime", (req, res) => {});

export default api;
