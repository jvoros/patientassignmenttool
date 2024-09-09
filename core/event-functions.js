import {
  EVENT_LIMIT,
  newId,
  shortTimestamp,
  findShiftById,
} from "./helper-functions.js";

const makeEvent = (type, message, options = {}) => {
  return {
    id: newId(),
    time: shortTimestamp(),
    type,
    message,
    shiftId: options?.shiftId,
    patientId: options?.patientId,
    detail: options?.detail,
  };
};

const setDetail = (event, detailMessage) => {
  return { ...event, detail: detailMessage };
};

const addEvent = (board, type, message, options) => {
  const newBoard = structuredClone(board);
  const newEvent = makeEvent(type, message, options);
  newBoard.events = [newEvent, ...board.events.slice(0, EVENT_LIMIT)];
  return newBoard;
};

const addShiftEvent = (board, shiftId, msg) => {
  const shift = findShiftById(board, shiftId);
  return addEvent(
    board,
    "board",
    `${shift.provider.first} ${shift.provider.last} ${msg}.`,
    { shiftId: shift.id }
  );
};

export default { makeEvent, setDetail, addEvent, addShiftEvent };
