import Rotation from "./rotation";
import Event from "./event";
import db from "./db.js";

// API
const addShift = async (
  state: State,
  provider: Provider,
  scheduleId: number
): Promise<State> => {
  const newShift = await db.addShift(provider.id, scheduleId);
  const miniShift = { id: newShift.id, type: newShift.type };
  const newState = joinBoard(state, miniShift);
  const newStateWithEvent = await Event.addToState(newState, {
    type: "addShift",
    shiftId: newShift.id,
  });
  return newStateWithEvent;
};

const flexOn = async (state: State, shift: ShiftTuple): Promise<State> => {
  const onMain = addToMain(state, shift);
  const offFlex = removeFromZone("flex")(onMain, shift.id);
  const newStateWithEvent = await Event.addToState(offFlex, {
    type: "flexOn",
    shiftId: shift.id,
  });
  return newStateWithEvent;
};

const flexOff = async (state: State, shift: ShiftTuple): Promise<State> => {
  const offMain = leaveMain(state, shift);
  const onFlex = addToZone("flex")(offMain, shift);
  const newStateWithEvent = await Event.addToState(onFlex, {
    type: "flexOff",
    shiftId: shift.id,
  });
  return newStateWithEvent;
};

const joinFt = async (state: State, shiftId: number): Promise<State> => {
  const newState = setNextFt(state, shiftId);
  const newStateWithEvent = await Event.addToState(newState, {
    type: "joinFt",
    shiftId,
  });
  return newStateWithEvent;
};

const leaveFt = async (state: State, shiftId: number): Promise<State> => {
  if (!isNextFt(state, shiftId)) return state;
  const newState = setNextFt(state, null);
  const newStateWithEvent = await Event.addToState(newState, {
    type: "leaveFt",
    shiftId,
  });
  return newStateWithEvent;
};

const signOut = async (state: State, shift: ShiftTuple): Promise<State> => {
  const leftMain = leaveMain(state, shift);
  const leftApp = leaveAppZones(leftMain, shift.id);
  const addOff = addToZone("off")(leftApp, shift);
  const newStateWithEvent = Event.addToState(addOff, {
    type: "signOut",
    shiftId: shift.id,
  });
  return newStateWithEvent;
};

const rejoin = async (state: State, shift: ShiftTuple): Promise<State> => {
  const takeOff = removeFromZone("off")(state, shift.id);
  const onBoard = joinBoard(takeOff, shift);
  const newStateWithEvent = Event.addToState(onBoard, {
    type: "rejoin",
    shiftId: shift.id,
  });
  return newStateWithEvent;
};

// INTERNAL
// Zones
const joinBoard = (state: State, shift: ShiftTuple): State => {
  return shift.type === "physician"
    ? addDoctorToMain(state, shift)
    : addToAppZones(state, shift);
};

const addToMain = (state: State, shift: ShiftTuple): State => {
  // set as next
  const newNext = setNextProvider(state, shift.id);
  // add at start, if empty, or as up next
  const insertIndex = !state.nextProvider
    ? 0
    : state.main.findIndex((s) => s.id === state.nextProvider);
  const newState = structuredClone(state);
  newState.main.splice(insertIndex, 0, shift);
  return newState;
};

const addDoctorToMain = (state: State, shift: ShiftTuple): State => {
  // add as super only if empty
  const stateWithSuper = state.nextSupervisor
    ? state
    : setNextSupervisor(state, shift.id);
  const newState = addToMain(stateWithSuper, shift);
  return newState;
};

const addToAppZones = (state: State, shift: ShiftTuple): State => {
  const stateWithFlex = addToZone("flex")(state, shift);
  const newState = !state.nextFt
    ? setNextFt(stateWithFlex, shift.id)
    : stateWithFlex;
  return newState;
};

const leaveMain = (state: State, shift: ShiftTuple): State => {
  // error checks before changes
  if (
    isLastDoctorOnMain(state, shift) ||
    state.main.findIndex((s) => s.id === shift.id) < 0
  ) {
    return state;
  }
  const offNexts = handleNextsOnLeaveMain(state, shift.id);
  const newState = removeFromZone("main")(offNexts, shift.id);
  return newState;
};

const leaveAppZones = (state: State, shiftId: number): State => {
  const offFlex = removeFromZone("flex")(state, shiftId);
  const newState = isNextFt(offFlex, shiftId)
    ? { ...offFlex, nextFt: null }
    : offFlex;
  return newState;
};

const handleNextsOnLeaveMain = (state: State, shiftId: number): State => {
  const nexts = ["nextProvider", "nextSupervisor"];
  const newState = structuredClone(state);
  nexts.forEach((next: Next) => {
    newState[next] =
      newState[next] === shiftId
        ? Rotation.getNextShiftId(state, next)
        : newState[next];
  });
  return newState;
};

// Helpers
const isLastDoctorOnMain = (state: State, shift: ShiftTuple): boolean =>
  state.main.length < 2 && shift.type === "physician";

const addToZone =
  (zone) =>
  (state: State, shift: ShiftTuple): State => {
    const newState = structuredClone(state);
    newState[zone].push(shift);
    return newState;
  };

const removeFromZone =
  (zone) =>
  (state: State, shiftId: number): State => {
    const newState = structuredClone(state);
    newState[zone] = state[zone].filter((shift) => shift.id !== shiftId);
    return newState;
  };

// Nexts
const isNextFt = (state: State, shiftId: number): boolean =>
  state.nextFt === shiftId;

const setNext = (whichNext: Next, state: State, shiftId: number): State => {
  const newState = structuredClone(state);
  newState[whichNext] = shiftId;
  return newState;
};

const setNextProvider = (state: State, shiftId: number): State =>
  setNext("nextProvider", state, shiftId);

const setNextSupervisor = (state: State, shiftId: number): State =>
  setNext("nextSupervisor", state, shiftId);

const setNextFt = (state: State, shiftId: number): State =>
  setNext("nextFt", state, shiftId);

export default {
  addShift,
  flexOn,
  flexOff,
  joinFt,
  leaveFt,
  signOut,
  rejoin,
};
