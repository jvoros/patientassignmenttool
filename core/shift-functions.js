import Rotation from "./rotation-functions.js";
import Event from "./event-functions.js";

// API
const addShift = async (board, providerId, scheduleId) => {
  const newShift = await db.addShift(providerId, scheduleId);
  const newState = joinBoard(board.state, newShift);
  const newStateWithEvent = await Event.addToState(newState, "addShift", {
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
  if (!isNextFt(board.state, shiftId)) return board.state;
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
  const insertIndex = !state.next ? 0 : state.main.indexOf(state.next);
  const newState = {
    ...state,
    main: state.main.toSpliced(insertIndex, 0, shiftId),
  };
  return newState;
};

const addDoctorToMain = (state, shiftId) => {
  // add as super only if empty
  const stateWithSuper = state.nextSupervisor
    ? state
    : setNextSupervisor(state, shiftId);
  const newState = addToMain(stateWithSuper, shiftId);
  return newState;
};

const addToAppZones = (state, shiftId) => {
  const stateWithFlex = addToZone("flex")(state, shiftId);
  const newState = !state.nextFt
    ? setNextFt(stateWithFlex, shiftId)
    : stateWithFlex;
  return newState;
};

const leaveMain = (board, shift) => {
  // error checks before changes
  if (
    isLastDoctorOnMain(board.state, shift) ||
    !board.state.main.includes(shift.id)
  ) {
    return board.state;
  }
  const offNexts = handleNextsOnLeave(board, shift.id);
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

const handleNextsOnLeave = (board, shiftId) => {
  const nexts = ["nextProvider", "nextSupervisor"];
  const newState = { ...board.state };
  nexts.forEach((next) => {
    newState[next] =
      newState[next] === shiftId
        ? Rotation.getNextShiftId(board, next)
        : newState[next];
  });
  return newState;
};

// Helpers
const isDoctor = (provider) => provider.role === "physician";

const isLastDoctorOnMain = (state, shift) =>
  state.main.length < 2 && isDoctor(shift.provider);

const addToZone = (zone) => (state, shiftId) => ({
  ...state,
  [zone]: [...state[zone], shiftId],
});

const removeFromZone = (zone) => (state, shiftId) => ({
  ...state,
  [zone]: state[zone].filter((id) => id !== shiftId),
});

// Nexts
const isNextFt = (state, shiftId) => state.nextFt === shiftId;

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
