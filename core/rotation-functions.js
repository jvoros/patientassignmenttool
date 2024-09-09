import Event from "./event-functions.js";
import { findShiftById, findIndexAndNeighbor } from "./helper-functions.js";

const getNext = (board, whichNext, offset = 1) => {
  const nextShift = getNextShift(board, whichNext, offset);
  return whichNext === "nextSupervisor" && nextShift.type === "app"
    ? getNext(board, whichNext, offset)
    : nextShift.id;
};

const moveNext = (board, whichNext, offset, event = true) => {
  let newBoard = structuredClone(board);
  const nextShift = getNext(newBoard, whichNext, offset);
  newBoard[whichNext] = nextShift.id;
  if (event) {
    const isSup = whichNext === "nextSupervisor";
    const msg = isSup ? "set as next supervisor" : "set as up next";
    const fullMsg = `${nextShift.provider.first} ${nextShift.provider.last} ${msg}`;
    newBoard = Event.addShiftEvent(newBoard, nextShift.id, fullMsg);
  }
  return newBoard;
};

const moveShiftInRotation = (board, shiftId, offset) => {
  let newBoard = structuredClone(board);
  const rotation = newBoard.main;
  const { index, nextIndex, nextShiftId } = findIndexAndNeighbor(
    board,
    shiftId,
    offset
  );
  rotation.splice(nextIndex, 0, rotation.splice(index, 1)[0]);
  newBoard = Event.addShiftEvent(board, shiftId, "changed position");
  return newBoard;
};

// HELPERS
const getNextShift = (board, whichNext, offset) => {
  const nextShiftId = findIndexAndNeighbor(
    board,
    board[whichNext],
    offset
  ).nextShiftId;
  return findShiftById(board, nextShiftId);
};

// CONVENIENCE
const getNextPatient = (board) => getNext(board, "nextPatient");

const getNextSupervisor = (board) => getNext(board, "nextSupervisor");

const moveNextPatient = (board, offset) =>
  moveNext(board, "nextPatient", offset);

const moveNextSupervisor = (board, offset) =>
  moveNext(board, "nextSupervisor", offset);

const moveShift = (board, shiftId, offset) =>
  moveShiftInRotation(board, shiftId, offset);

export default {
  getNextPatient,
  getNextSupervisor,
  moveNextPatient,
  moveNextSupervisor,
  moveShift,
};
