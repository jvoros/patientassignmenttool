// use capitalization for controllers
import Rotation from "./rotation.js";
import Shift from "./shift.js";
import Event from "./event.js";
import Patient from "./patient.js";

// export for use in history api
export const EVENT_LIMIT = 25;

const initialState = {
  rotations: [
    Rotation.make("Main", true, true),
    // Rotation.make("Fast Track"),
    Rotation.make("Off"),
  ],
  shifts: [],
  events: [],
};

function createBoardStore() {
  let state = initialState;
  let history = [];

  function reset() {
    state.rotations.map((rot) => {
      rot.pointer = 0;
    });
    state.shifts = [];
    state.events = [];
    addEvent("reset", "Board reset", null);
    return;
  }

  function getState() {
    return state;
  }

  // SHIFT Functions

  function addNewShift(doctor, options) {
    addShift(Shift.make(doctor, options));
    return;
  }

  function addShift(newShift, noEvent = false) {
    const rot = findRotationById(newShift.rotationId);

    // adjust order of rotation shifts
    const newOrder =
      rot.cycle.patient && shiftCount(rot.id) > 0
        ? findShiftById(rot.next.patient).order
        : 0;
    newShift.order = newOrder;
    state.shifts = [
      newShift,
      ...handleRotationOrder(newShift.rotationId, newOrder, "add"),
    ];

    // handle nextShift assignments
    // new shift becomes next in rotation
    modifyRotationById(
      newShift.rotationId,
      Rotation.setNext,
      "patient",
      newShift.id
    );
    // if no one on nextMidlevel, and new shift not midlevel, make next
    if (!rot.next.midlevel && !newShift.doctor.app) {
      modifyRotationById(
        newShift.rotationId,
        Rotation.setNext,
        "midlevel",
        newShift.id
      );
    }

    // event
    if (noEvent) return;
    const message = `${newShift.doctor.first} ${newShift.doctor.last} joined ${rot.name}`;
    addEvent("join", message, newShift);
    return;
  }

  // needs some work, doesn't handle case where midlevel is only one left on rotation
  function moveShiftToRotation(moveShiftId, newRotationId) {
    let moveShift = findShiftById(moveShiftId);
    const startingRot = findRotationById(moveShift.rotationId);

    // handle any active nextShift assignments
    // need to do this before changing order because needs shift order to work
    // if it is last shift in rotation
    if (shiftCount(startingRot.id) === 1) {
      startingRot.next.patient = null;
      startingRot.next.midlevel = null;
    } else {
      // if was not last shift
      ["patient", "midlevel"].forEach((cycle) => {
        if (startingRot.next[cycle] === moveShift.id)
          moveNext(cycle, startingRot.id, 1, true);
      });
    }

    // filter out the moved shift
    state.shifts = state.shifts.filter((s) => s.id !== moveShiftId);
    // redo orders
    state.shifts = handleRotationOrder(
      moveShift.rotationId,
      moveShift.order,
      "remove"
    );

    // add shift back in to new rotation
    moveShift = Shift.setRotation(moveShift, newRotationId);
    addShift(moveShift, "noEvent");

    // event
    const message = [
      moveShift.doctor.first,
      moveShift.doctor.last,
      "moved to",
      findRotationById(newRotationId).name,
    ].join(" ");
    addEvent("move", message, moveShift);
    return;
  }

  function moveShift(shiftId, offset) {
    const shift = findShiftById(shiftId);
    const rotationId = shift.rotationId;
    const oldOrder = shift.order;
    const newOrder = shift.order + offset;
    //early return for moving beyond bounds of rotation
    if (newOrder < 0 || newOrder >= shiftCount(rotationId)) return;

    state.shifts = state.shifts.map((shift) =>
      shift.id === shiftId
        ? Shift.setOrder(shift, newOrder)
        : shift.rotationId !== rotationId
        ? shift
        : shift.order === newOrder
        ? Shift.setOrder(shift, oldOrder)
        : shift
    );
    //event
    const message = [
      shift.doctor.first,
      shift.doctor.last,
      "changed position",
    ].join(" ");
    addEvent("order", message, shift);
    return;
  }

  // CYCLE functions

  function moveNext(cycle, rotationId, offset, noEvent = false) {
    const rot = findRotationById(rotationId);
    if (!rot.cycle[cycle]) return;

    const startShift = findShiftById(rot.next[cycle]);
    const nextShift = findNeighborShift(rotationId, startShift.order, offset);

    // fire turn complete for current shift if patient cycle
    if (cycle === "patient") modifyShiftById(startShift.id, Shift.turnComplete);

    // set new next[cycle]Shift
    // have to set before skip check, otherwise infinite recurrence off start shift and next shift having skip
    // need to start next recurrence from the skip shift
    modifyRotationById(rotationId, Rotation.setNext, cycle, nextShift.id);

    // handle skip conditions for patient cycle or midlevel cycle
    if (cycle === "patient" && nextShift.skip)
      moveNext("patient", rotationId, offset, true);

    if (cycle === "midlevel" && nextShift.doctor.app) {
      // first check that there is a doc shift in rotation

      // if so, can advance
      moveNext("midlevel", rotationId, offset, true);

      // otherwise set nextMidlevelShift to null
    }

    // event
    // flag to fire without event
    if (noEvent) return;
    // event has different shift based on pointer direction
    const eventShift = offset === 1 ? startShift : nextShift;
    // event has different 'skip' and 'back' based on cycle
    const skip = cycle === "midlevel" ? "APP Skipped" : "Skipped";
    const back = cycle === "midlevel" ? "APP Back to" : "Back to";
    const message = [
      offset === 1 ? skip : back,
      eventShift.doctor.first,
      eventShift.doctor.last,
    ].join(" ");
    addEvent("pointer", message, eventShift);
    return;
  }

  // PATIENT & MIDLEVEL functions

  function assignPatient(shiftId, type, room, movePointer = true) {
    const newPatient = Patient.make(type, room);
    modifyShiftById(shiftId, Shift.addPatient, newPatient);
    const shift = findShiftById(shiftId);

    // if new total > bonus move pointer without pointer event
    // AND movePointer === true
    if (shift.counts.total > shift.bonus && movePointer === true)
      moveNext("patient", shift.rotationId, 1, true);

    // make event
    const message = [
      room,
      "assigned to",
      shift.doctor.first,
      shift.doctor.last,
    ].join(" ");
    addEvent("assign", message, shift, newPatient);
    return;
  }

  function reassignPatient(eventId, newShiftId) {
    const event = findById(state.events, eventId);
    modifyShiftById(event.shift.id, Shift.removePatient, event.patient.id);
    modifyShiftById(newShiftId, Shift.addPatient, event.patient);
    const newShift = findShiftById(newShiftId);
    // modify original event
    state.events = modifyById(
      state.events,
      eventId,
      Event.setReassign,
      newShift.doctor
    );
    // make event
    const message = [
      event.patient.room,
      "reassigned to",
      newShift.doctor.first,
      newShift.doctor.last,
    ].join(" ");
    addEvent("assign", message, newShift, event.patient);
    return;
  }

  function staffMidlevel(rotationId, shiftId) {
    const shift = findShiftById(shiftId);
    modifyShiftById(shiftId, Shift.addPatient, Patient.make("app", 0));
    moveNext("midlevel", rotationId, 1, "noEvent");
    const message = [
      shift.doctor.first,
      shift.doctor.last,
      "staffed with APP",
    ].join(" ");
    addEvent("staff", message, shift);
  }

  // HELPERS
  // function to take rotation or shift arrays
  // and modify just the specified shift, returns the full array
  // Shift and Rotation functions return a new shift that replaces the old
  // Don't need to pass shift or rotation to function, modifyById handles that as first arg
  function modifyById(arr, itemId, func, ...args) {
    return arr.map((item) => {
      return item.id === itemId ? func(item, ...args) : item;
    });
  }

  function modifyRotationById(rotationId, func, ...args) {
    state.rotations = modifyById(state.rotations, rotationId, func, ...args);
  }

  function modifyShiftById(shiftId, func, ...args) {
    state.shifts = modifyById(state.shifts, shiftId, func, ...args);
  }

  // find shifts or rotations
  function findById(arr, id) {
    return arr.find((r) => r.id === id);
  }

  function findRotationById(id) {
    return findById(state.rotations, id);
  }

  function findShiftById(id) {
    return findById(state.shifts, id);
  }

  function findShiftByOrder(rotationId, order) {
    return state.shifts.find(
      (s) => s.rotationId === rotationId && s.order === order
    );
  }

  function shiftCount(rotationId) {
    return state.shifts.filter((s) => s.rotationId === rotationId).length;
  }

  function findNeighborShift(rotationId, order, offset) {
    const rot = findRotationById(rotationId);
    const startShift = findShiftByOrder(rotationId, order);
    const newOrder =
      (startShift.order + offset + shiftCount(rotationId)) %
      shiftCount(rotationId);
    return findShiftByOrder(rotationId, newOrder);
  }

  // takes all shifts, adjusts order just for shifts in a rotation
  // cutoff can be pointer, or the order of shift being moved
  function handleRotationOrder(rotationId, cutoff, operation = "add") {
    const offset = operation === "add" ? 1 : -1;
    return state.shifts.map((shift) => {
      if (shift.rotationId !== rotationId) return shift;
      if (shift.order < cutoff) return shift;
      return Shift.setOrder(shift, shift.order + offset);
    });
  }

  // HISTORY
  function undo() {
    // shift() removes and returns first array item
    state = JSON.parse(history.shift());
  }

  // limits # of events
  function addEvent(type, message, shift, patient = null) {
    state.events = [
      Event.make(type, message, shift, patient),
      ...state.events.slice(0, EVENT_LIMIT),
    ];
  }

  function saveHistory() {
    history = [JSON.stringify(state), ...history.slice(0, EVENT_LIMIT)];
  }

  // history wrapper
  function withHistory(func) {
    return function (...args) {
      saveHistory();
      return func(...args);
    };
  }

  return {
    getState,
    reset: withHistory(reset),
    addNewShift: withHistory(addNewShift),
    moveShiftToRotation: withHistory(moveShiftToRotation),
    moveNext: withHistory(moveNext),
    moveShift: withHistory(moveShift),
    assignPatient: withHistory(assignPatient),
    reassignPatient: withHistory(reassignPatient),
    staffMidlevel: withHistory(staffMidlevel),
    undo,
  };
}

export default createBoardStore;
