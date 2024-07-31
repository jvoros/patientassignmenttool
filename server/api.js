import fs from "fs";
import express from "express";
import { board } from "../index.js";
import sendmail from "./mailer.js";

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
  const { provider, options } = req.body;
  if (options.id === 1) {
    // before reset, log shift totals to shift_log.txt
    const data = [];
    const date = new Date();
    board.getState().shifts.forEach((shift) => {
      data.push(
        `${date.toLocaleDateString("en-US")}, ${shift.doctor.last}, ${
          shift.doctor.last
        }, ${shift.counts.total > 0 ? shift.counts.total : 0}`
      );
    });
    const message = "\n" + data.join("\n");
    fs.appendFileSync("./server/shift_log.txt", message);

    // email shift totals and shift_log
    const mailOptions = {
      from: "jeremy.voros@carepointhc.com",
      to: "jeremy.voros@carepointhc.com",
      subject: "Patient Assignment Tools Log",
      text: message,
      attachments: [
        {
          filename: "shift_log.txt",
          path: "./server/shift_log.txt",
        },
      ],
    };
    sendmail(mailOptions, (info) => {
      console.log("Email sent successfully");
      console.log("MESSAGE ID: ", info.messageId);
    });

    board.reset();
  }
  board.addShift(provider, options);
  responder(res);
});

api.post("/moveShift", (req, res) => {
  const { shiftId, offset } = req.body;
  board.moveShiftInRotation(shiftId, offset);
  responder(res);
});

api.post("/signOut", (req, res) => {
  const shiftId = req.body.shiftId;
  board.signOut(shiftId);
  responder(res);
});

api.post("/signOn", (req, res) => {
  const shiftId = req.body.shiftId;
  board.rejoinRotation(shiftId);
  responder(res);
});

api.post("/appFlexOn", (req, res) => {
  const shiftId = req.body.shiftId;
  board.appFlexOn(shiftId);
  responder(res);
});

api.post("/appFlexOff", (req, res) => {
  const shiftId = req.body.shiftId;
  board.appFlexOff(shiftId);
  responder(res);
});

api.post("/joinFT", (req, res) => {
  const shiftId = req.body.shiftId;
  board.jointFT(shiftId);
  responder(res);
});

api.post("/leaveFT", (req, res) => {
  const shiftId = req.body.shiftId;
  board.leaveFT(shiftId);
  responder(res);
});

api.post("/moveShiftToRotation", (req, res) => {
  const { rotationId, shiftId } = req.body;
  board.moveShiftToRotation(shiftId, rotationId);
  responder(res);
});

api.post("/moveNext", (req, res) => {
  const { cycle, offset } = req.body;
  console.log("moveNext args: ", cycle, offset);
  board.moveNext(cycle, offset);
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
