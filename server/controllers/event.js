import { shortTimestamp } from "./helpers.js";

/**************
 * 
 * Types of Events
 * - patient arrival: rotation, type, room, doctor
 *  - walk-in: rotation, room, doctor
 *  - ambo: rotation, room, doctor
 *  - fast track: rotation, room, doctor
 * - join rotation: rotation, doctor
 * - leave rotation: rotation, doctor
 * - move pointer: rotation, direction (skip, if forward, back to, if back), doctor
 * - move doctor: rotation, doctor
 * 
 * all events have:
 *  - time
 *  - type, rotation, doctor
 * 
 * some events have:
 *  - room #
 *  - msg
 * 
 * Almost all events relate to a rotation. Rotation returns events after each action
 * 
 */

function make(action, rotation, doctor, msg = '') {
  return {
    time: shortTimestamp(),
    action: action,
    rotation: rotation,
    doctor: doctor,
    message: msg
  }
}

export default { make }
