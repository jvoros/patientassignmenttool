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
 * - "reset"
 *
 */

function make(type, message, shift, patient = null, detail = null) {
  return {
    id: uid.rnd(),
    time: shortTimestamp(),
    type,
    shift,
    message,
    patient,
    detail,
  };
}

function setDetail(event, detailMessage) {
  return { ...event, detail: detailMessage };
}

export default { make, setDetail };
