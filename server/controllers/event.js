import { shortTimestamp } from "./helpers.js";
import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId();

/*
 * Types of Events
 * All events relate to a shift
 * All events have a message
 * Some events have a patient
 *  - Every patient has a type and room number
 * Some events have a reassign
 *
 * Events types
 * - "assign" patient assigned
 * - "join" joined rotation
 * - "move" move rotation
 * - "pointer" move pointer
 * - "order" change shift order
 *
 */

function make(type, message, shift, patient = null) {
  return {
    id: uid.rnd(),
    time: shortTimestamp(),
    type,
    shift,
    message,
    patient,
  };
}

function setReassign(event, newDoctor) {
  return { ...event, reassign: newDoctor };
}

export default { make, setReassign };
