import Rotation from "./rotation.js";
import Event from "./event.js";
import db from "./db.js";

// API
// shift object from client {id, type, info {bonus} patients {count} }
// pt { type, room } from client
const assignPatient = async (
  state,
  shift,
  pt = { type, room },
  advance = true
) => {
  const supervisor = withSupervisor(state, shift);
  const newPtId = await db.addPatient(pt.room, pt.type, shift.id, {
    supervisorId: supervisor,
  });
  const newState = handleNexts(state, shift, supervisor, advance);
  const newStateWithEvent = await Event.addToState(newState, "addPatient", {
    shiftId: shift.id,
    patientId: newPtId,
  });
  return newStateWithEvent;
};

// event from client
const reassignPatient = async (state, event, newShift = { id, provider }) => {
  const { newSupervisorId, newState } = handleReassignSupervisor(
    state,
    event.shift.provider,
    newShift.provider
  );
  const updatedPt = await db.updatePatient(
    event.patient.id,
    newShift.id,
    newSupervisorId
  );
  const newStateWithEvent = await Event.addToState(newState, "reassign", {
    patientId: event.patient.id,
    shiftId: newShift.id,
  });
  return newStateWithEvent;
};

// INTERNAL

const withSupervisor = (state, shift) => {
  return shift.type === "app" ? state.nextSupervisor : null;
};

const handleNexts = (state, shift, supervisor, advance) => {
  const nextSupervisor = getNextSupervisor(state, supervisor);
  const nextProvider = getNextProvider(state, shift, advance);
  return { ...state, nextSupervisor, nextProvider };
};

const getNextSupervisor = (state, supervisor) => {
  return supervisor
    ? Rotation.getNextShiftId(state, "nextSupervisor")
    : state.nextSupervisor;
};

const getNextProvider = (state, shift, advance) => {
  return shouldAdvance(shift, advance)
    ? Rotation.getNextShiftId(state, "nextProvider")
    : state.nextProvider;
};

const shouldAdvance = (shift, advance) =>
  shift.patients.count >= shift.info.bonus && advance;

export const handleReassignSupervisor = (
  state,
  currentProvider,
  newProvider
) => {
  const currentSupervisorId = state.nextSupervisor;
  let newSupervisorId = "";
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
