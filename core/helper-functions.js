import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId();

export const EVENT_LIMIT = 50;

export const newId = () => uid.rnd();

export const shortTimestamp = () => {
  const timestamp = new Date();
  return timestamp.toLocaleString("en-US", {
    timeZone: "America/Denver",
    timeStyle: "short",
  });
};

export const findShiftById = (board, shiftId) => {
  return board.shifts.find((shift) => shift.id === shiftId);
};

export const findIndexAndNeighbor = (board, shiftId, offset) => {
  const rotation = board.main;
  const index = rotation.indexOf(shiftId);
  const nextIndex = (index + offset + rotation.length) % rotation.length;
  return { index, nextIndex, nextShiftId: rotation[nextIndex] };
};

// https://dev.to/atomikjaye/styling-consolelog-in-the-terminal-25c1
export const logObject = (text, obj) => {
  console.log(`\x1b[33m#### ${text} ####\x1b[0m`);
  console.log(" ");
  console.dir(obj, { depth: 99 });
  console.log(" ");
};
