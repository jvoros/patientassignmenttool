import Event from "./event";

// API
const getNextShiftId = (
  state: State,
  whichNext: Next,
  offset: number = 1
): number => {
  const directionMultiplier = offset < 1 ? -1 : 1; // will keep recursion going correct direction
  const neighborShift = getNeighborShift(state, whichNext, offset);
  const nextShiftId = shouldRecurseForNextSupervisor(whichNext, neighborShift)
    ? getNextShiftId(state, whichNext, offset + 1 * directionMultiplier)
    : neighborShift.id;
  return nextShiftId;
};

const moveNext = async (
  state: State,
  whichNext: Next,
  offset = 1
): Promise<State> => {
  const nextShiftId = getNextShiftId(state, whichNext, offset);
  const newState = structuredClone(state);
  newState[whichNext] = nextShiftId;
  const newStateWithEvent = await Event.addToState(newState, {
    type: `move-${whichNext}`,
    shiftId: nextShiftId,
  });
  return newStateWithEvent;
};

const moveShiftInRotation = async (
  state: State,
  shiftId: number,
  offset = 1
): Promise<State> => {
  const newState = structuredClone(state);
  const rotation = newState.main;
  const { index, nextIndex, nextShift } = findIndexAndNeighbor(
    state,
    shiftId,
    offset
  );
  rotation.splice(nextIndex, 0, rotation.splice(index, 1)[0]);
  const newStateWithEvent = await Event.addToState(newState, {
    type: "adjustRotation",
    shiftId,
  });
  return newStateWithEvent;
};

// HELPERS
const getNeighborShift = (
  state: State,
  whichNext: Next,
  offset: number
): ShiftTuple =>
  findIndexAndNeighbor(state, state[whichNext], offset).nextShift;

const findIndexAndNeighbor = (
  state: State,
  shiftId: number,
  offset: number
): IndexAndNeighbor => {
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
