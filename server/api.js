import fs from "fs";
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
    // before reset, log shift totals to shift_log.txt
    const data = [];
    const date = new Date();
    board.getState().shifts.forEach((shift) => {
      data.push(
        `${date.toLocaleDateString("en-US")}, ${shift.doctor.first}, ${
          shift.counts.total > 0 ? shift.counts.total : 0
        }`
      );
    });
    fs.appendFileSync("./server/shift_log.txt", "\n" + data.join("\n"));

    // email shift totals and shift_log
    // new code here...

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

api.post("/moveNext", (req, res) => {
  const { cycle, rotationId, offset } = req.body;
  console.log("moveNext args: ", cycle, rotationId, offset);
  board.moveNext(cycle, rotationId, offset);
  responder(res);
});

api.post("/assignPatient", (req, res) => {
  const { shiftId, type, room, movePointer } = req.body;
  board.assignPatient(shiftId, type, room, movePointer);
  responder(res);
});

api.post("/reassign", (req, res) => {
  const { eventId, shiftId } = req.body;
  board.reassignPatient(eventId, shiftId);
  responder(res);
});

api.post("/staffMidlevel", (req, res) => {
  const { rotationId, shiftId } = req.body;
  board.staffMidlevel(rotationId, shiftId);
  responder(res);
});

api.post("/toggleSkip", (req, res) => {
  const { shiftId } = req.body;
  board.toggleSkip(shiftId);
  responder(res);
});

api.post("/undo", (_req, res) => {
  board.undo();
  responder(res);
});

export default api;
