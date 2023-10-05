import { shortTimestamp } from './helpers.js';

function make(type, room) {
  return {
    time: shortTimestamp(),
    type: type,
    room: room
  }
}

export default { make };