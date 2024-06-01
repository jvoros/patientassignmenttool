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
// export function responder(res) {
//   // client browser needs a response to know transmission complete
//   res.status(200).json({ message: "success" });
//   // state payload sent to client by socket.io
//   res.io.emit("new state", board.getState());
// }

function responder(res, data) {
  res.status(200).json({ message: "success", data });
}

async function getSiteDetails(site_id, detail) {
  const { data, error } = await supabase
    .from("sites")
    .select("*, sites!inner(site_id)")
    .eq("sites.site_id", site_id);

  return data;
}

// NEW API

// takes site_id comes from token

api.post("/getsitedetails", async (req, res) => {
  const { data: siteInfo, error } = await supabase
    .from("sites")
    .select("id, name, zones(*), shift_types(*), clinicians(*)")
    .eq("id", req.token.site_id)
    .limit(1)
    .single()
    .order("site_order", { referencedTable: "zones" })
    .order("lname", { referencedTable: "clinicians" });
  responder(res, siteInfo);
});

api.post("/getshifts", async (req, res) => {
  const { data: shifts, error } = await supabase
    .from("shifts")
    .select(
      `*,
      clinician:clinician_id(*, clinician_type:clinician_type_id(*)), 
      details:shift_type_id(name, start, end),
      patients:patients!shift_id(*),
      supervised_patients:patients!supervisor_shift_id(*)`
    )
    .eq("site_id", req.token.site_id)
    .order("zone_id", { ascending: true })
    .order("zone_order", { ascending: true });
  console.log(error);
  responder(res, shifts);
});

api.post("/getevents", async (req, res) => {
  const { data: events, error } = await supabase
    .from("events")
    .select(
      `
      *, 
      shift:shift_id(*, clinician:clinician_id(*)), 
      patient:patient_id(*)`
    )
    .eq("site_id", req.token.site_id)
    .order("created_at", { ascending: false });
  console.log(error);
  responder(res, events);
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
