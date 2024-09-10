import Shift from "./shift-functions.js";
import Rotation from "./rotation-functions.js";
import { newId, shortTimestamp, findShiftById } from "./helper-functions.js";

const assignPatient = (board, shiftId, type, room, advanceRotation = true) => {
  const newBoard = structuredClone(board);
  const patient = Patient.make(type, room);
  const shift = findShiftById(newBoard, shiftId);
  const isShiftApp = shift.type === "app";
  const supShift = isShiftApp ? findShiftById(newBoard.nextSupervisor) : "";
  // add patient to shift
  Shift.addPatient(shift, patient.id);
  // is app shift? add patient to supervisor and set nextSupervisor
  if (supShift) {
    Shift.addPatient(supShift, Patient.make("app", 0));
    newBoard.nextSupervisor = Rotation.getNextSupervisor(newBoard);
  }
  // should rotation advance? set NextPatient
  if (shift.counts.total > shift.bonus && advanceRotation === true) {
    newBoard.nextPatient = Rotation.getNextPatient(newBoard);
  }
  // add event
  const msg = `${room} assigned to ${shift.provider.first} ${shift.provider.last}`;
  const detail = isShiftApp
    ? `supervisor: ${supShift.provider.first} ${supShift.provider.last}`
    : "";
  newBoard = Event.addEvent("assign", msg, {
    shiftId: shift.id,
    patientId: patient.id,
    detail,
  });
  return newBoard;

  // old code....
  // add patient
  modifyShiftById(shiftId, Shift.addPatient, patient);

  // add supervisor
  if (shift.app) superviseApp(supShiftId);

  // advance rotation?
  //if > bonus and advanceRotation === true
  const updated_count = findShiftById(shiftId).counts.total;
  if (updated_count > shift.bonus && advanceRotation === true) {
    moveNext("patient", 1, "noevent");
  }

  // event
  const supShift1 = findShiftById(supShiftId);
  const message = `${room} assigned to ${shift.provider.first} ${shift.provider.last}`;
  const eventDetail = supShiftId
    ? `with ${supShift.provider.first} ${supShift.provider.last}`
    : null;
  addEvent("assign", message, shift, patient, eventDetail);
  return newBoard;
};

function superviseApp(shiftId) {
  modifyShiftById(shiftId, Shift.addPatient, Patient.make("app", 0));
  moveNext("sup", 1, "noevent");
}

function reassignPatient(eventId, newShiftId) {
  // get the event
  const event = state.events.find((e) => e.id === eventId);
  // remove pt from first shift, add to second
  modifyShiftById(event.shift.id, Shift.removePatient, event.patient.id);
  const newShift = findShiftById(newShiftId);
  // if new shift is app, add an app patient to original doc
  if (newShift.app) {
    modifyShiftById(event.shift.id, Shift.addPatient, Patient.make("app", 0));
  }
  modifyShiftById(newShiftId, Shift.addPatient, event.patient);
  // events
  // modify original event
  state.events = modifyById(
    state.events,
    eventId,
    Event.setDetail,
    "reassigned to " + newShift.provider.first + " " + newShift.provider.last
  );
  // make event
  const detail = newShift.app
    ? `with ${event.shift.provider.first} ${event.shift.provider.last}`
    : "";
  addEvent("assign", "", newShift, event.patient, detail);
  return;
}

function addApp(eventId, newShiftId) {
  // get the event
  const event = state.events.find((x) => event.id === eventId);
  // remove pt from first shift, readd as app patient type
  modifyShiftById(event.shift.id, Shift.removePatient, event.patient.id);
  modifyShiftById(
    newShiftId,
    Shift.addPatient,
    Patient.make("app", event.patient.room)
  );
  // event
  const newShift = findShiftById(newShiftId);
  state.events = modifyById(
    state.events,
    eventId,
    Event.setDetail,
    "with APP: " + newShift.provider.first + " " + newShift.provider.last
  );
}

// HELPERS

const newBoardWithAssignEvent = (board, shift, supShift, ptId) => {
  const msg = `${room} assigned to ${shift.provider.first} ${shift.provider.last}`;
  const detail =
    shift.type === "app"
      ? `supervisor: ${supShift.provider.first} ${supShift.provider.last}`
      : "";
  return Event.addEvent(board, "assign", msg, {
    shiftId: shift.id,
    patientId: patient.id,
    detail,
  });
};

export default { makePatient };
