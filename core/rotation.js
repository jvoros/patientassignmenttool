import Event from "./event.js";

// API
const getNextShiftId = (state, whichNext, offset = 1) => {
  const directionMultiplier = offset < 1 ? -1 : 1; // will keep recursion going correct direction
  const neighborShift = getNeighborShift(state, whichNext, offset);
  const nextShiftId = shouldRecurseForNextSupervisor(whichNext, neighborShift)
    ? getNextShiftId(state, whichNext, offset + 1 * directionMultiplier)
    : neighborShift.id;
  return nextShiftId;
};

const moveNext = async (state, whichNext, offset = 1) => {
  const nextShiftId = getNextShiftId(state, whichNext, offset);
  const newState = structuredClone(state);
  newState[whichNext] = nextShiftId;
  const newStateWithEvent = await Event.addToState(
    newState,
    `move-${whichNext}`,
    {
      shiftId: nextShiftId,
    }
  );
  return newStateWithEvent;
};

const moveShiftInRotation = (state, shiftId, offset = 1) => {
  const newState = structuredClone(state);
  const rotation = newState.main;
  const { index, nextIndex, nextShift } = findIndexAndNeighbor(
    state,
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
const getNeighborShift = (state, whichNext, offset) =>
  findIndexAndNeighbor(state, state[whichNext], offset).nextShift;

const findIndexAndNeighbor = (state, shiftId, offset) => {
  const index = state.main.findIndex((shift) => shift.id === shiftId);
  const length = state.main.length;
  const nextIndex = (index + offset + length) % length;
  return { index, nextIndex, nextShift: state.main[nextIndex] };
};

const shouldRecurseForNextSupervisor = (whichNext, neighborShift) => {
  return neighborShift.type === "app" && whichNext === "nextSupervisor";
};

export default {
  getNextShiftId,
  moveNext,
  moveShiftInRotation,
};
