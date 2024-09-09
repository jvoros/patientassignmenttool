import {
  EVENT_LIMIT,
  newId,
  shortTimestamp,
  findShiftById,
} from "./helper-functions.js";

const addEvent = async (board, type, message, options) => {
  // add event to db
  const eventId = await db.newEvent(type, message, options);
  // add event to board
  const newBoard = {
    ...board,
    events: [newEvent, ...board.events.slice(0, EVENT_LIMIT)],
  };
  // update event with state
  const updatedEventId = await db.updateEvent(eventId, newBoard);
  // return new board
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
