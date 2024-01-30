import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId();
import { shortTimestamp } from "./helpers.js";

function make(type, room) {
  return {
    id: uid.rnd(),
    time: shortTimestamp(),
    type: type,
    room: room,
  };
}

export default { make };
