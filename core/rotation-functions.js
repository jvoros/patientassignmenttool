import Event from "./event-functions.js";

// API
const getNextShiftId = (board, whichNext, offset = 1) => {
  const neighborShift = getNeighborShift(board, whichNext, offset);
  const nextShiftId = shouldRecurseForNextSupervisor(whichNext, neighborShift)
    ? getNextShiftId(board, whichNext, offset)
    : nextShift.id;
  return nextShiftId;
};

const moveNext = async (board, whichNext, offset) => {
  const nextShift = getNeighborShift(board, whichNext, offset);
  const newState = { ...board.state, [whichNext]: nextShift.id };
  const newStateWithEvent = await Event.addToState(
    newState,
    `move-${whichNext}`,
    {
      shiftId: nextShift.id,
    }
  );
  return newStateWithEvent;
};

const moveShiftInRotation = (board, shiftId, offset) => {
  const newState = { ...board.state };
  const rotation = newState.main;
  const { index, nextIndex, nextShift } = findIndexAndNeighbor(
    board,
    shiftId,
    offset
  );
  rotation.splice(nextIndex, 0, rotation.splice(index, 1)[0]);
  const newStateWithEvent = Event.addToState(newState, "adjustRotation", {
    shiftId,
  });
  return newStateWithEvent;
};

// HELPERS
const getNeighborShift = (board, whichNext, offset) =>
  findIndexAndNeighbor(board, board[whichNext], offset).nextShift;

const findIndexAndNeighbor = (board, shiftId, offset) => {
  const rotation = board.main;
  const index = rotation.indexOf(shiftId);
  const nextIndex = (index + offset + rotation.length) % rotation.length;
  return { index, nextIndex, nextShift: rotation[nextIndex] };
};

const shouldRecurseForNextSupervisor = (whichNext, neighborShift) => {
  return neighborShift.type === "app" && whichNext === "nextSupervisor";
};

export default {
  getNextShiftId,
  moveNext,
  moveShiftInRotation,
};
