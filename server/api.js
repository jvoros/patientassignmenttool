import express from "express";
import db from "./db.js";
// EXPRESS
const api = express.Router();

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

// NEW API

// SETUP SCRIPTS
// takes site_id comes from token
api.post("/getsitedetails", async (req, res) => {
  const siteInfo = await db.getSiteDetails(req.token.site_id);
  responder(res, siteInfo);
});

api.post("/getshifts", async (req, res) => {
  const shifts = await db.getShifts(req.token.site_id);
  responder(res, shifts);
});

api.post("/getevents", async (req, res) => {
  const events = await db.getEvents(req.token.site_id);
  responder(res, events);
});

// SHIFTS
api.post("/addshift", async (req, res) => {
  const { clinicianId, shiftTypeId, zoneId } = req.body;
  console.log(data);

  // get current next_shift
  const { data: zoneData, error: zoneError } = await supabase
    .from("zones")
    .select("next_shift_id")
    .eq("zone_id", zoneId)
    .single();

  if (zoneError) {
    console.error("Error fetching next_shift_id:", zoneError);
    return;
  }

  const nextShiftId = zoneData.next_shift_id;

  // get order of next_shift
  const { data: shiftData, error: shiftError } = await supabase
    .from("shifts")
    .select("order_in_zone")
    .eq("shift_id", nextShiftId)
    .single();

  if (shiftError) {
    console.error("Error fetching order_in_zone:", shiftError);
    return;
  }

  const orderInZone = shiftData.order_in_zone;

  //add shift with that order
  const { data: newShift, error: newShiftError } = await supabase
    .from("shifts")
    .insert([
      {
        shift_type_id: shiftTypeId,
        site_id: req.token.site_id,
        zone_id: zoneId,
        clinician_id: clinicianId,
        order_in_zone: orderInZone,
      },
    ])
    .single();

  if (newShiftError) {
    console.error("Error inserting new shift:", newShiftError);
    return;
  }

  // update shift orders for zone
  const { error: updateError } = await supabase
    .from("shifts")
    .update({ order_in_zone: supabase.raw("order_in_zone + 1") })
    .eq("zone_id", zoneId)
    .gte("order_in_zone", orderInZone)
    .neq("shift_id", newShift.shift_id); // only update if not new shift

  if (updateError) {
    console.error("Error updating order_in_zone:", updateError);
    return;
  }

  // update zone
  const { error: zoneUpdateError } = await supabase
    .from("zones")
    .update({ next_shift_id: newShiftId })
    .eq("zone_id", zoneId);

  if (zoneUpdateError) throw zoneUpdateError;

  console.log(
    "New shift inserted, order updated, and zone.next_shift_id updated successfully"
  );
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
