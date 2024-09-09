import Rotation from "./rotation-functions.js";
import Event from "./event-functions.js";
import { newId, findShiftById } from "./helper-functions.js";

// BASE SHIFT
const makeShift = (provider, schedule) => ({
  id: newId(),
  provider,
  name: schedule.name,
  bonus: schedule.bonus,
  type: schedule.type, // app, physician, resident, pit
  patients: [], //array of pt IDs
  counts: {},
});

const addPatient = (shift, pt) => {
  shift.patients = [pt, ...shift.patients];
  updateCounts(shift);
};

const removePatient = (shift, ptId) => {
  shift.patients = shift.patients.filter((p) => p.id !== ptId);
  updateCounts(shift);
};

const updateCounts = (shift) => {
  shift.counts = shift.patients.reduce(
    (result, pt) => {
      result.total++;
      result[pt.type] = (result[pt.type] || 0) + 1;
      return result;
    },
    { total: 0 }
  );
};

// BIG BOYS IN API
const addShift = (board, provider, schedule) => {
  let newBoard = structuredClone(board);
  const newShift = makeShift(provider, schedule);
  newBoard.shifts.unshift(newShift);
  logOnToAppropriateZone(newBoard, newShift);
  return newBoardWithEvent(newBoard, newShift.id, "joined rotation");
};

const flexOn = (board, shiftId) => {
  const newBoard = structuredClone(board);
  joinMain(newBoard, shiftId, false);
  removeFromZone("flex")(newBoard, shiftId);
  return newBoardWithEvent(newBoard, shiftId, "flexed on rotation");
};

const flexOff = (board, shiftId) => {
  const newBoard = structuredClone(board);
  leaveMain(newBoard, shiftId);
  addToZone("flex")(newBoard, shiftId);
  return newBoardWithEvent(newBoard, shiftId, "flexed off rotation");
};

const joinFT = (board, shiftId) => {
  const newBoard = structuredClone(board);
  addToZone("ft")(newBoard, shiftId);
  return newBoardWithEvent(newBoard, shiftId, "joined fast track");
};

const leaveFT = (board, shiftId) => {
  const newBoard = structuredClone(board);
  removeFromZone("ft")(board, shiftId);
  return newBoardWithEvent(newBoard, shiftId, "left fast track");
};

const signOut = (board, shiftId) => {
  const newBoard = structuredClone(board);
  if (board.main.includes(shiftId)) {
    leaveMain(newBoard, shiftId);
  }
  leaveAppZones(newBoard, shiftId);
  addToZone("off")(newBoard, shiftId);
  return newBoardWithEvent(newBoard, shiftId, "signed out");
};

const rejoin = (board, shiftId) => {
  const newBoard = structuredClone(board);
  if (isDoctor(board, shiftId)) {
    joinMain(newBoard, shiftId);
  } else {
    joinAppZones(newBoard, shiftId);
  }
  removeFromZone("off")(newBoard, shiftId);
  return newBoardWithEvent(newBoard, shiftId, "rejoined board");
};

// INTERNAL
// Not pure functions - modify board in place

// MAIN ZONE
const logOnToAppropriateZone = (board, shiftId) =>
  isDoctor(board, shiftId)
    ? joinMain(board, shiftId)
    : joinAppZones(board, shiftId);

const joinMain = (board, shiftId) => {
  if (!isZoneEmpty("main")(board)) {
    const insertIndex = board.main.indexOf(board.nextPatient);
    board.main.splice(insertIndex, 0, shiftId);
  } else {
    addToZone("main")(board, shiftId);
  }
  handleNextsOnJoin(newBoard, shiftId);
};

const leaveMain = (board, shiftId) => {
  if (isLastDoctorOnMain(board, shiftId)) {
    return;
  }
  handleNextsOnLeave(board, shiftId);
  removeFromZone("main")(board, shiftId);
};

const handleNextsOnJoin = (board, shiftId) => {
  board.nextPatient = shiftId;
  if (!board.nextSupervisor && isDoctor(board, shiftId)) {
    board.nextSupervisor = shiftId;
  }
};

const handleNextsOnLeave = (board, shiftId) => {
  if (isNextPatient(board, shiftId)) {
    board.nextPatient = Rotation.getNextPatient(board);
  }
  if (isNextSupervisor(board, shiftId)) {
    board.nextSupervisor = Rotation.getNextSupervisor(board);
  }
};

// APP ZONES
const joinAppZones = (board, shiftId) => {
  addToZone("flex")(board, shiftId);
  if (isZoneEmpty("ft")(board)) {
    addToZone("ft")(board, shiftId);
  }
};

const leaveAppZones = (board, shiftId) => {
  ["flex", "ft"].forEach((zone) => {
    removeFromZone(zone)(board, shiftId);
  });
};

// HELPERS
const newBoardWithEvent = (board, shiftId, msg) =>
  Event.newShiftEvent(board, shiftId, msg);

const isDoctor = (board, shiftId) =>
  findShiftById(board, shiftId).type === "physician";

const isLastDoctorOnMain = (board, shiftId) =>
  board.main.length < 2 && isDoctor(board, shiftId);

const isNextPatient = (board, shiftId) => board.nextPatient === shiftId;

const isNextSupervisor = (board, shiftId) => board.nextSupervisor === shiftId;

const isZoneEmpty = (zone) => (board) => board[zone].length === 0;

const addToZone = (zone) => (board, shiftId) => {
  board[zone] = [...board[zone], shiftId];
};

const removeFromZone = (zone) => (board, shiftId) => {
  board[zone] = board[zone].filter((id) => id !== shiftId);
};

export default {
  makeShift,
  addPatient,
  removePatient,
  addShift,
  flexOn,
  flexOff,
  joinFT,
  leaveFT,
  signOut,
  rejoin,
};
