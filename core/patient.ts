import Rotation from "./rotation";
import Event from "./event";
import db from "./db";

// API
// shift and pt come hydrated from client
const assignPatient = async (
  state: State,
  shift: Shift,
  pt: Patient,
  advance: boolean = true
) => {
  const supervisorId = withSupervisor(state, shift);
  const newPtId = await db.addPatient({
    type: pt.type,
    room: pt.room,
    shiftId: shift.id,
    supervisorId: supervisorId,
  });
  const newState = handleNexts(state, shift, supervisorId, advance);
  const newStateWithEvent = await Event.addToState(newState, {
    type: "addPatient",
    shiftId: shift.id,
    patientId: newPtId,
  });
  return newStateWithEvent;
};

// event from client
const reassignPatient = async (
  state: State,
  event: BoardEvent,
  newShift: Shift
) => {
  const { newSupervisorId, newState } = handleReassignSupervisor(
    state,
    event.shift.provider,
    newShift.provider
  );
  const updatedPt = await db.updatePatient(event.patient.id, {
    shiftId: newShift.id,
    supervisorId: newSupervisorId,
  });
  const newStateWithEvent = await Event.addToState(newState, {
    type: "reassign",
    patientId: event.patient.id,
    shiftId: newShift.id,
  });
  return newStateWithEvent;
};

// INTERNAL

const withSupervisor = (state: State, shift: Shift) => {
  return shift.type === "app" ? state.nextSupervisor : null;
};

const handleNexts = (
  state: State,
  shift: Shift,
  supervisorId: number,
  advance: boolean
) => {
  const nextSupervisor = getNextSupervisor(state, supervisorId);
  const nextProvider = getNextProvider(state, shift, advance);
  return { ...state, nextSupervisor, nextProvider };
};

const getNextSupervisor = (state: State, supervisorId: number): number => {
  return supervisorId
    ? Rotation.getNextShiftId(state, "nextSupervisor")
    : state.nextSupervisor;
};

const getNextProvider = (
  state: State,
  shift: Shift,
  advance: boolean
): number => {
  return shouldAdvance(shift, advance)
    ? Rotation.getNextShiftId(state, "nextProvider")
    : state.nextProvider;
};

const shouldAdvance = (shift: Shift, advance: boolean): boolean =>
  shift.patients.count >= shift.info.bonus && advance;

export const handleReassignSupervisor = (
  state: State,
  currentProvider: Provider,
  newProvider: Provider
) => {
  const currentSupervisorId = state.nextSupervisor;
  let newSupervisorId = null;
  let newState = structuredClone(state);

  // if new = doc and current = doc
  // if new = doc and current = app
  if (newProvider.role === "physician") {
    newSupervisorId = currentSupervisorId;
  } else if (currentProvider.role === "physician") {
    // if new = app and current = physician
    newSupervisorId = currentProvider.id;
  } else {
    // if new = app and current = app
    newSupervisorId = state.nextSupervisor;
    newState.nextSupervisor = Rotation.getNextShiftId(state, "nextSupervisor");
  }

  return { newSupervisorId, newState };
};

export default { assignPatient, reassignPatient };
