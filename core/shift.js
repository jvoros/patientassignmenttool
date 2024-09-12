import Rotation from "./rotation.js/index.js";
import Event from "./event.js/index.js";

// API
// provider {id, role}
const addShift = async (state, provider, scheduleId) => {
  const newShift = await db.addShift(provider.id, scheduleId);
  const newState = joinBoard(state, newShift);
  const newStateWithEvent = await Event.addToState(newState, "addShift", {
    shiftId: newShift.id,
  });
  return newStateWithEvent;
};

const flexOn = async (state, shift = { id, role }) => {
  const onMain = addToMain(state, shift);
  const offFlex = removeFromZone("flex")(onMain, shiftId);
  const newStateWithEvent = await Event.addToState(offFlex, "flexOn", {
    shiftId,
  });
  return newStateWithEvent;
};

const flexOff = async (state, shift) => {
  const offMain = leaveMain(state, shift.id);
  const onFlex = addToZone("flex")(offMain, shift);
  const newStateWithEvent = await Event.addToState(onFlex, "flexOff", {
    shiftId: shift.id,
  });
  return newStateWithEvent;
};

const joinFt = (state, shiftId) => {
  const newState = setNextFt(board.state, shiftId);
  const newStateWithEvent = Event.addToState(newState, "joinFt", {
    shiftId,
  });
  return newStateWithEvent;
};

const leaveFt = (state, shiftId) => {
  if (!isNextFt(state, shiftId)) return board.state;
  const newState = setNextFt(state, null);
  const newStateWithEvent = Event.addToState(newState, "leaveFt", {
    shiftId,
  });
  return newStateWithEvent;
};

const signOut = (state, shift) => {
  const leftMain = leaveMain(board, shift.id);
  const leftApp = leaveAppZones(leftMain, shift.id);
  const addOff = addToZone("off")(leftApp, shift);
  const newStateWithEvent = Event.addToState(addOff, "signOut", {
    shiftId: shift.id,
  });
  return newStateWithEvent;
};

const rejoin = (state, shift) => {
  const takeOff = removeFromZone("off")(state, shift.id);
  const onBoard = joinBoard(takeOff, shift);
  const newStateWithEvent = Event.addToState(onBoard, "rejoin", {
    shiftId: shift.id,
  });
  return newStateWithEvent;
};

// INTERNAL
// Zones
const joinBoard = (state, shift) => {
  return shift.type === "physician"
    ? addDoctorToMain(state, shift)
    : addToAppZones(state, shift);
};

const addToMain = (state, shift) => {
  const miniShift = { id: shift.id, t: shift.type };
  // set as next
  const newNext = setNextProvider(state, shift.id);
  // add at start, if empty, or as up next
  const insertIndex = !state.next
    ? 0
    : state.main.findIndex((s) => s.id === state.next);
  const newState = structuredClone(state);
  newState.main = state.main.toSpliced(insertIndex, 0, miniShift);
  return newState;
};

const addDoctorToMain = (state, shift) => {
  // add as super only if empty
  const stateWithSuper = state.nextSupervisor
    ? state
    : setNextSupervisor(state, shift.id);
  const newState = addToMain(stateWithSuper, shift);
  return newState;
};

const addToAppZones = (state, shiftId) => {
  const stateWithFlex = addToZone("flex")(state, shiftId);
  const newState = !state.nextFt
    ? setNextFt(stateWithFlex, shiftId)
    : stateWithFlex;
  return newState;
};

const leaveMain = (state, shift) => {
  // error checks before changes
  if (isLastDoctorOnMain(state, shift) || !state.main.includes(shift.id)) {
    return state;
  }
  const offNexts = handleNextsOnLeave(state, shift.id);
  const newState = removeFromZone("main")(offNexts, shift.id);
  return newState;
};

const leaveAppZones = (state, shiftId) => {
  const offFlex = removeFromZone("flex")(state, shiftId);
  const newState = isNextFt(offFlex, shiftId)
    ? { ...offFlex, nextFt: null }
    : offFlex;
  return newState;
};

const handleNextsOnLeave = (state, shiftId) => {
  const nexts = ["nextProvider", "nextSupervisor"];
  const newState = structuredClone(state);
  nexts.forEach((next) => {
    newState[next] =
      newState[next] === shiftId
        ? Rotation.getNextShiftId(state, next)
        : newState[next];
  });
  return newState;
};

// Helpers
const isLastDoctorOnMain = (state, shift) =>
  state.main.length < 2 && shift.t === "physician";

const addToZone = (zone) => (state, shiftId) => {
  const newState = structuredClone(state);
  newState[zone].push(shiftId);
  return newState;
};

const removeFromZone = (zone) => (state, shiftId) => {
  const newState = structuredClone(state);
  newState[zone] = state[zone].filter((id) => id !== shiftId);
  return newState;
};

// Nexts
const isNextFt = (state, shiftId) => state.nextFt === shiftId;

const setNext = (whichNext, state, shiftId) => {
  const newState = structuredClone(state);
  newState[whichNext] = shiftId;
  return newState;
};

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
