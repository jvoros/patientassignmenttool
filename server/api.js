import express from "express";
import { board, getPath, responder } from "../index.js";

const api = express.Router();

// MIDDLEWARE
// if 'nurse' then admin actions at bottom
const confirmRole = (requiredRole) => (req, res, next) => {
  if (!req.user.role || req.user.role !== requiredRole) {
    return res.status(401).json({ message: "Unauthorized Request" });
  }
  return next();
};

// MAIN API
api.post("/board", (_req, res) => {
  responder(res);
});

api.post("/history", (req, res) => {
  res.json(history.getState());
});

api.post("/doctors", async (req, res) => {
  res.status(200).sendFile(getPath("./json/doctors.json"));
});

api.post("/shifts", async (req, res) => {
  res.status(200).sendFile(getPath("./json/shift_details.json"));
});

api.post("/addShift", (req, res) => {
  const { doctor, options } = req.body;
  if (options.id === 1) {
    console.log("Resetting board...");
    board.reset();
  }
  board.addNewShift(doctor, options);
  responder(res);
});

api.post("/moveShift", (req, res) => {
  const { shiftId, offset } = req.body;
  board.moveShift(shiftId, offset);
  responder(res);
});

api.post("/moveShiftToRotation", (req, res) => {
  const { rotationId, shiftId } = req.body;
  board.moveShiftToRotation(shiftId, rotationId);
  responder(res);
});

api.post("/moveRotationPointer", (req, res) => {
  const { rotationId, offset } = req.body;
  board.moveRotationPointer(rotationId, offset);
  responder(res);
});

api.post("/assignPatient", (req, res) => {
  const { shiftId, type, room } = req.body;
  board.assignPatient(shiftId, type, room);
  responder(res);
});

api.post("/reassign", (req, res) => {
  const { eventId, shiftId } = req.body;
  board.reassignPatient(eventId, shiftId);
  responder(res);
});

api.post("/undo", (_req, res) => {
  board.undo();
  responder(res);
});

// PROTECTED ADMIN ACTIONS
api.use(confirmRole("nurse"));

api.get("/backintime", (req, res) => {});

export default api;
