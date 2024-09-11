import Event from "./event.js";

// API
const getNextShiftId = (board, whichNext, offset = 1) => {
  const directionMultiplier = offset < 1 ? -1 : 1; // will keep recursion going correct direction
  const neighborShift = getNeighborShift(board, whichNext, offset);
  const nextShiftId = shouldRecurseForNextSupervisor(whichNext, neighborShift)
    ? getNextShiftId(board, whichNext, offset + 1 * directionMultiplier)
    : neighborShift.id;
  return nextShiftId;
};

const moveNext = async (board, whichNext, offset = 1) => {
  const nextShiftId = getNextShiftId(board, whichNext, offset);
  const newState = { ...board.state, [whichNext]: nextShiftId };
  const newStateWithEvent = await Event.addToState(
    newState,
    `move-${whichNext}`,
    {
      shiftId: nextShiftId,
    }
  );
  return newStateWithEvent;
};

const moveShiftInRotation = (board, shiftId, offset = 1) => {
  const newState = structuredClone(board.state);
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
