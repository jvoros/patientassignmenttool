import express from "express";
import { createClient } from "@supabase/supabase-js";

// EXPRESS
const api = express.Router();

// SUPABASE
export const supabase = createClient(
  "http://localhost:54321",
  process.env.SUPABASE_API
);

// HELPERS
export function responder(res) {
  // client browser needs a response to know transmission complete
  res.status(200).json({ message: "success" });
  // state payload sent to client by socket.io
  res.io.emit("new state", board.getState());
}

// NEW API

// takes site info from token, then queries database to get data for site
api.post("/getboard", async (req, res) => {
  console.log("getting board...");
  const board = {};
  board.site_id = req.token.site_id;
  console.log(board);
  res.json(message("success", "board incoming"));
});

// OLD API

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
