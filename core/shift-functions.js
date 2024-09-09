import Rotation from "./rotation-functions.js";
import Event from "./event-functions.js";

// BIG BOYS IN API
const addShift = async (board, provider, schedule) => {
  const newShift = await db.addShift(provider.id, schedule.id);
  const newBoard = joinBoard(board, newShift);
  return await Event.addEvent(newBoard, "board", "joined the board.", {
    shiftId: newShift.id,
  });
};

const flexOn = async (board, shiftId) => {
  const onMain = addToMain(board, shiftId);
  const offFlex = removeFromZone("flex")(onMain, shiftId);
  return await Event.addEvent(offFlex, "board", "flexed on rotation.", {
    shiftId,
  });
};

const flexOff = async (board, shiftId) => {
  const offMain = leaveMain(board, shiftId);
  const onFlex = addToZone("flex")(offMain, shiftId);
  return await Event.addEvent(onFlex, "board", "flexed off rotation", {
    shiftId,
  });
};

const joinFt = (board, shiftId) => {
  const newBoard = setNextFt(board, shiftId);
  return Event.addEvent(newBoard, "board", "joined Fast Track", {
    shiftId,
  });
};

const leaveFt = (board, shiftId) => {
  if (!isNextFt(board, shiftId)) return board;
  const newBoard = setNextFt(board, null);
  return Event.addEvent(newBoard, "board", "left fast track", { shiftId });
};

const signOut = (board, shiftId) => {
  const leftApp = leaveAppZones(board, shiftId);
  const leftMain = leaveMain(leftApp, shiftId);
  const addOff = addToZone("off")(leftMain, shiftId);
  return Event.addEvent(addOff, "board", "signed out.", { shiftId });
};

const rejoin = (board, shift) => {
  const takeOff = removeFromZone("off")(board, shift.id);
  const onBoard = joinBoard(takeOff, shift);
  return Event.addEvent(onBoard, "board", "rejoined board", {
    shiftId: shift.id,
  });
};

// INTERNAL
// ZONES
const joinBoard = (board, shift) => {
  return isDoctor(shift.provider)
    ? addDoctorToMain(board, shift.id)
    : addToAppZones(board, shift.id);
};

const addToMain = (board, shiftId) => {
  // set as next
  const newNext = setNextProvider(board, shiftId);
  // add at start, if empty, or as up next
  if (isZoneEmpty("main")(board)) {
    return addToZone("main")(newNext, shiftId);
  }
  const insertIndex = board.main.indexOf(board.next);
  return { ...board, main: board.main.toSpliced(insertIndex, 0, shiftId) };
};

const addDoctorToMain = (board, shiftId) => {
  // add as super only if empty
  const boardWithSuper = board.nextSupervisor
    ? board
    : setNextSupervisor(board, shiftId);
  return addToMain(boardWithSuper, shiftId);
};

const addToAppZones = (board, shiftId) => {
  const newBoard = addToZone("flex")(board, shiftId);
  return isZoneEmpty("ft")(board) ? { ...board, ft: shiftId } : newBoard;
};

const leaveMain = (board, shift) => {
  // error checks before changes
  if (isLastDoctorOnMain(board, shift) || !board.main.includes(shift.id)) {
    return board;
  }
  const newBoard = removeFromZone("main")(board, shift.id);
  return handleNextsOnLeave(board, shift.id);
};

const leaveAppZones = (board, shiftId) => {
  const newBoard = removeFromZone("flex")(board, shiftId);
  return shiftId === board.ft ? { ...newBoard, ft: null } : newBoard;
};

const handleNextsOnLeave = (board, shiftId) => {
  const nexts = ["nextProvider", "nextSupervisor"];
  const newBoard = { ...board };
  nexts.forEach((next) => {
    if (board[next] === shiftId) {
      newBoard[next] = Rotation.getNext(board, next);
    }
  });
  return newBoard;
};

// HELPERS
const isDoctor = (provider) => provider.role === "physician";

const isLastDoctorOnMain = (board, shift) =>
  board.main.length < 2 && isDoctor(shift.provider);

const isZoneEmpty = (zone) => (board) => board[zone].length === 0;

const addToZone = (zone) => (board, shiftId) => ({
  ...board,
  [zone]: [...board[zone], shiftId],
});

const removeFromZone = (zone) => (board, shiftId) => ({
  ...board,
  [zone]: board[zone].filter((id) => id !== shiftId),
});

// NEXTS
const isNext = (whichNext, board, shiftId) => board[whichNext] === shiftId;
const isNextFt = (board, shiftId) => isNext("nextFt", board, shiftId);

const setNext = (whichNext, board, shiftId) => ({
  ...board,
  [whichNext]: shiftId,
});

const setNextProvider = (board, shiftId) =>
  setNext("nextProvider", board, shiftId);

const setNextSupervisor = (board, shiftId) =>
  setNext("nextSupervisor", board, shiftId);

const setNextFt = (board, shiftId) => setNext("nextFt", board, shiftId);

export default {
  addShift,
  flexOn,
  flexOff,
  joinFt,
  leaveFt,
  signOut,
  rejoin,
};
