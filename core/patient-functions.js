import Rotation from "./rotation-functions.js";
import Event from "./event-functions.js";

// API
const assignPatient = async (board, shift, type, room, advance = true) => {
  const supervisor = withSupervisor(board, shift);
  const newPtId = await db.addPatient(room, type, shift.id, {
    supervisorId: supervisor,
  });
  const newState = handleNexts(board, shift, supervisor, advance);
  const newStateWithEvent = await Event.addToState(newState, "addPatient", {
    shiftId: shift.id,
    patientId: newPtId,
  });
  return newStateWithEvent;
};

const reassignPatient = async (board, event, newShift) => {
  const { newSupervisorId, newState } = handleReassignSupervisor(
    board,
    event.shift.provider,
    newShift.provider
  );
  const updatedPt = await db.updatePatientProvider(
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

const withSupervisor = (board, shift) => {
  return shift.provider.role === "app" ? board.state.nextSupervisor : null;
};

const handleNexts = (board, shift, supervisor, advance) => {
  const nextSupervisor = getNextSupervisor(board, supervisor);
  const nextProvider = getNextProvider(board, shift, advance);
  return { ...board.state, nextSupervisor, nextProvider };
};

const getNextSupervisor = (board, supervisor) => {
  return supervisor
    ? Rotation.getNextShiftId(board, "nextSupervisor")
    : board.state.nextSupervisor;
};

const getNextProvider = (board, shift, advance) => {
  return shouldAdvance(shift, advance)
    ? Rotation.getNextShiftId(board, "nextProvider")
    : board.state.nextProvider;
};

const shouldAdvance = (shift, advance) =>
  shift.counts.total >= shift.info.bonus && advance;

const handleReassignSupervisor = (board, currentProvider, newProvider) => {
  let newSupervisorId = "";
  let newState = { ...board.state };

  // if new = doc and current = doc
  // if new = doc and current = app
  if (newProvider.role === "physician") {
    newSupervisorId = null;
  } else if (currentProvider.role === "physician") {
    // if new = app and current = physician
    newSupervisorId = currentProvider.id;
  } else {
    // if new = app and current = app
    newSupervisorId = state.nextSupervisor;
    newState.nextSupervisor = Rotation.getNextShiftId(board, "nextSupervisor");
  }

  return { newSupervisorId, newState };
};

export default { assignPatient, reassignPatient };
