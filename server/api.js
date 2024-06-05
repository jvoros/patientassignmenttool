import express from "express";
import db from "./db/db.js";

import { broadcastUpdate } from "../index.js";

// EXPRESS
const api = express.Router();

// HELPERS
// export function responder(res) {
//   // client browser needs a response to know transmission complete
//   res.status(200).json({ message: "success" });
//   // state payload sent to client by socket.io
//   res.io.emit("new state", board.getState());
// }

async function responder(req, res) {
  res.status(200).json({ message: "success" });
  broadcastUpdate(JSON.stringify(await getBoard(req.token.site_id)));
}

async function getBoard(site_id) {
  const siteInfo = await db.getSiteDetails(site_id);
  const shifts = await db.getShifts(site_id);
  const events = await db.getEvents(site_id);
  return {
    siteInfo,
    shifts,
    events,
  };
}

// NEW API

// BOARD
// takes site_id comes from token
api.post("/getboard", async (req, res) => {
  responder(req, res);
});

// api.post("/getsitedetails", async (req, res) => {
//   const siteInfo = await db.getSiteDetails(req.token.site_id);
//   responder(res, siteInfo);
// });

// api.post("/getshifts", async (req, res) => {
//   const shifts = await db.getShifts(req.token.site_id);
//   responder(res, shifts);
// });

// api.post("/getevents", async (req, res) => {
//   const events = await db.getEvents(req.token.site_id);
//   responder(res, events);
// });

// SHIFTS
api.post("/addshift", async (req, res) => {
  const { clinicianId, shiftTypeId, zoneId } = req.body;
  console.log("api addshift");
  const query = await db.addShift(
    clinicianId,
    shiftTypeId,
    zoneId,
    req.token.site_id
  );
  responder(res, query);
});

api.post("/testevents", (_req, _res) => {
  broadcastUpdate("testevents");
});

// OLD API

// api.post("/addShift", (req, res) => {
//   const { doctor, options } = req.body;
//   if (options.id === 1) {
//     board.reset();
//   }
//   board.addNewShift(doctor, options);
//   responder(res);
// });

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
