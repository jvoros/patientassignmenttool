import { shortTimestamp } from "./helpers.js";

/**************
 *
 * Types of Events
 * All Event relate to a doctor, this is use of timeline to see what
 * is happening with the doctors
 *
 * - patient assigned: rotation, type, room, doctor
 *  - walk-in: rotation, room, doctor
 *  - ambo: rotation, room, doctor
 *  - fast track: rotation, room, doctor
 * - joined rotation: rotation, doctor
 * - leave rotation: rotation, doctor
 * - move pointer: rotation, direction (skip, if forward, back to, if back), doctor
 * - moved doctor: rotation, doctor
 *
 * all events have:
 *  - time
 *  - action: assign patient, join rotation, switch rotation, change order, skip, go back,
 *  - rotation
 *  - doctor
 *  - room?
 *  - patient type?
 *  - msg
 *
 * some events have:
 *  - room #
 *  - msg
 *
 * Almost all events relate to a rotation. Rotation returns events after each action
 *
 */

function make(
  action,
  rotation,
  doctor,
  { message = "", room = "", ptType = "" }
) {
  return {
    time: shortTimestamp(),
    action,
    rotation,
    doctor,
    message,
    room,
    ptType,
  };
}

export default { make };
