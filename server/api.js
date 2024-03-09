import express from "express";
import { board } from "../index.js";

const api = express.Router();

// HELPERS
export function responder(res) {
  // client browser needs a response to know transmission complete
  res.status(200).json({ message: "success" });
  // state payload sent to client by socket.io
  res.io.emit("new state", board.getState());
}

// MAIN API
api.post("/addShift", (req, res) => {
  const { doctor, options } = req.body;
  if (options.id === 1) {
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
  const { shiftId, type, room, movePointer } = req.body;
  console.log("movePointer: ", movePointer);
  board.assignPatient(shiftId, type, room, movePointer);
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

export default api;
