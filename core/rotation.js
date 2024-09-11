import Event from "./event.js";

// API
const getNextShiftId = (board, whichNext, offset = 1) => {
  const neighborShift = getNeighborShift(board, whichNext, offset);
  const nextShiftId = shouldRecurseForNextSupervisor(whichNext, neighborShift)
    ? getNextShiftId(board, whichNext, offset + 1)
    : neighborShift.id;
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
  findIndexAndNeighbor(board, board.state[whichNext], offset).nextShift;

const findIndexAndNeighbor = (board, shiftId, offset) => {
  const index = board.state.main.indexOf(shiftId);
  const length = board.state.main.length;
  const nextIndex = (index + offset + length) % length;
  return { index, nextIndex, nextShift: board.store.main[nextIndex] };
};

const shouldRecurseForNextSupervisor = (whichNext, neighborShift) => {
  return neighborShift.type === "app" && whichNext === "nextSupervisor";
};

export default {
  getNextShiftId,
  moveNext,
  moveShiftInRotation,
};
