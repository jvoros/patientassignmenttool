import { v4 as uuid } from "uuid";
import { shortTimestamp } from "./helpers.js";

function makePatient(type, room) {
  return {
    id: uuid(),
    time: shortTimestamp(),
    type: type,
    room: room,
  };
}

export default makePatient;
