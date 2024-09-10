import Rotation from "./rotation-functions.js";
import Event from "./event-functions.js";

// API
const addShift = async (board, provider, schedule) => {
  const newShift = await db.addShift(provider.id, schedule.id);
  const newState = joinBoard(board.state, newShift);
  const newStateWithEvent = await Event.addToState(newState, "join", {
    shiftId: newShift.id,
  });
  return newStateWithEvent;
};

const flexOn = async (board, shiftId) => {
  const onMain = addToMain(board.state, shiftId);
  const offFlex = removeFromZone("flex")(onMain, shiftId);
  const newStateWithEvent = await Event.addToState(offFlex, "flexOn", {
    shiftId,
  });
  return newStateWithEvent;
};

const flexOff = async (board, shiftId) => {
  const offMain = leaveMain(board, shiftId);
  const onFlex = addToZone("flex")(offMain, shiftId);
  const newStateWithEvent = await Event.addToState(onFlex, "flexOff", {
    shiftId,
  });
  return newStateWithEvent;
};

const joinFt = (board, shiftId) => {
  const newState = setNextFt(board.state, shiftId);
  const newStateWithEvent = Event.addToState(newState, "joinFt", {
    shiftId,
  });
  return newStateWithEvent;
};

const leaveFt = (board, shiftId) => {
  if (!isNextFt(board.state, shiftId)) return state;
  const newState = setNextFt(board.state, null);
  const newStateWithEvent = Event.addToState(newState, "leaveFt", {
    shiftId,
  });
  return newStateWithEvent;
};

const signOut = (board, shiftId) => {
  const leftMain = leaveMain(board, shiftId);
  const leftApp = leaveAppZones(leftMain, shiftId);
  const addOff = addToZone("off")(leftApp, shiftId);
  const newStateWithEvent = Event.addToState(addOff, "signOut", { shiftId });
  return newStateWithEvent;
};

const rejoin = (board, shift) => {
  const takeOff = removeFromZone("off")(board.state, shift.id);
  const onBoard = joinBoard(takeOff, shift);
  const newStateWithEvent = Event.addToState(onBoard, "rejoin", {
    shiftId: shift.id,
  });
  return newStateWithEvent;
};

// INTERNAL
// Zones
const joinBoard = (state, shift) => {
  return isDoctor(shift.provider)
    ? addDoctorToMain(state, shift.id)
    : addToAppZones(state, shift.id);
};

const addToMain = (state, shiftId) => {
  // set as next
  const newNext = setNextProvider(state, shiftId);
  // add at start, if empty, or as up next
  if (isZoneEmpty("main")(state)) {
    return addToZone("main")(newNext, shiftId);
  }
  const insertIndex = state.main.indexOf(state.next);
  return { ...state, main: state.main.toSpliced(insertIndex, 0, shiftId) };
};

const addDoctorToMain = (state, shiftId) => {
  // add as super only if empty
  const stateWithSuper = state.nextSupervisor
    ? state
    : setNextSupervisor(state, shiftId);
  return addToMain(stateWithSuper, shiftId);
};

const addToAppZones = (state, shiftId) => {
  const newState = addToZone("flex")(state, shiftId);
  return isZoneEmpty("ft")(state) ? { ...state, ft: shiftId } : newState;
};

const leaveMain = (board, shift) => {
  // takes in board, returns new state
  // needs board to get next
  // error checks before changes
  if (
    isLastDoctorOnMain(board.state, shift) ||
    !board.state.main.includes(shift.id)
  ) {
    return board.state;
  }
  const offNexts = handleNextsOnLeave(board, shift.id);
  const offMain = removeFromZone("main")(offNexts, shift.id);
  return offMain;
};

const leaveAppZones = (state, shiftId) => {
  const newState = removeFromZone("flex")(state, shiftId);
  return shiftId === state.ft ? { ...newState, ft: null } : newState;
};

const handleNextsOnLeave = (board, shiftId) => {
  const nexts = ["nextProvider", "nextSupervisor"];
  const newState = { ...board.state };
  nexts.forEach((next) => {
    if (newState[next] === shiftId) {
      newState[next] = Rotation.getNextShiftId(board, next);
    }
  });
  return newState;
};

// Helpers
const isDoctor = (provider) => provider.role === "physician";

const isLastDoctorOnMain = (state, shift) =>
  state.main.length < 2 && isDoctor(shift.provider);

const isZoneEmpty = (zone) => (state) => state[zone].length === 0;

const addToZone = (zone) => (state, shiftId) => ({
  ...state,
  [zone]: [...state[zone], shiftId],
});

const removeFromZone = (zone) => (state, shiftId) => ({
  ...state,
  [zone]: state[zone].filter((id) => id !== shiftId),
});

// Nexts
const isNext = (whichNext, state, shiftId) => state[whichNext] === shiftId;
const isNextFt = (state, shiftId) => isNext("nextFt", state, shiftId);

const setNext = (whichNext, state, shiftId) => ({
  ...state,
  [whichNext]: shiftId,
});

const setNextProvider = (state, shiftId) =>
  setNext("nextProvider", state, shiftId);

const setNextSupervisor = (state, shiftId) =>
  setNext("nextSupervisor", state, shiftId);

const setNextFt = (state, shiftId) => setNext("nextFt", state, shiftId);

export default {
  addShift,
  flexOn,
  flexOff,
  joinFt,
  leaveFt,
  signOut,
  rejoin,
};
