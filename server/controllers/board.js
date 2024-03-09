// use capitalization for controllers
import Rotation from "./rotation.js";
import Shift from "./shift.js";
import Event from "./event.js";
import Patient from "./patient.js";

// export for use in history api
export const EVENT_LIMIT = 25;

const initialState = {
  rotations: [
    Rotation.make("Main", true),
    Rotation.make("Fast Track"),
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
      rot.shiftCount = 0;
    });
    state.shifts = [];
    state.events = [];
    addEvent("reset", "Board reset", null);
    return;
  }

  function getState() {
    return state;
  }

  // DON'T NEED SORTED VERSION
  // function getRotationWithShifts(rotation) {
  //   return {
  //     ...rotation,
  //     shifts: state.shifts
  //       .filter((shift) => shift.rotationId === rotation.id)
  //       .sort((a, b) => a.order - b.order),
  //   };
  // }

  // function getSortedState() {
  //   return {
  //     rotations: {
  //       main: getRotationWithShifts(state.rotations[0]),
  //       fasttrack: getRotationWithShifts(state.rotations[1]),
  //       off: getRotationWithShifts(state.rotations[2]),
  //     },
  //     shifts: state.shifts,
  //     events: state.events,
  //   };
  // }

  // SHIFT Functions

  function addNewShift(doctor, options) {
    addShift(Shift.make(doctor, options));
    return;
  }

  function addShift(newShift, noEvent = false) {
    const rot = findRotationById(newShift.rotationId);
    newShift.order = rot.usePointer ? rot.pointer : 0;
    modifyRotationById(newShift.rotationId, Rotation.addShift);
    state.shifts = [
      newShift,
      ...handleRotationOrder(newShift.rotationId, rot.pointer, "add"),
    ];
    // event
    // flag to run function without event creation
    if (noEvent) return;
    const message = `${newShift.doctor.first} ${newShift.doctor.last} joined ${rot.name}`;
    addEvent("join", message, newShift);
    return;
  }

  function moveShiftToRotation(moveShiftId, newRotationId) {
    let moveShift = findShiftById(moveShiftId);
    // filter out the moved shift
    state.shifts = state.shifts.filter((s) => s.id !== moveShiftId);
    // redo orders
    state.shifts = handleRotationOrder(
      moveShift.rotationId,
      moveShift.order,
      "remove"
    );
    // update rotation
    modifyRotationById(
      moveShift.rotationId,
      Rotation.removeShift,
      moveShift.order
    );
    // add shift back in to new rotation
    // need shift for event also, let's make its own variable
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
    if (newOrder < 0 || newOrder >= findRotationById(rotationId).shiftCount)
      return;
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

  // POINTER functions

  function moveRotationPointer(rotationId, offset, noEvent = false) {
    const startingPointer = findRotationById(rotationId).pointer;
    // turn complete handler for active shift
    const activeShift = findShiftByOrder(
      rotationId,
      findRotationById(rotationId).pointer
    );
    modifyShiftById(activeShift.id, Shift.turnComplete);

    // advance pointer
    modifyRotationById(rotationId, Rotation.movePointer, offset);
    // check next shift for skip, if so, movePointer again
    // the turnComplete method will then fire for skipped shift
    const nextShift = findShiftByOrder(
      rotationId,
      findRotationById(rotationId).pointer
    );
    if (nextShift.skip) moveRotationPointer(rotationId, 1, true);

    // event
    // flag to fire without event
    if (noEvent) return;
    // event has different shift based on pointer direction
    const endingPointer = findRotationById(rotationId).pointer;
    const eventShift =
      offset === 1
        ? findShiftByOrder(rotationId, startingPointer)
        : findShiftByOrder(rotationId, endingPointer);
    const message = [
      offset === 1 ? "Skipped" : "Back to",
      eventShift.doctor.first,
      eventShift.doctor.last,
    ].join(" ");
    addEvent("pointer", message, eventShift);
    return;
  }

  // PATIENT functions

  function assignPatient(shiftId, type, room, movePointer = true) {
    const newPatient = Patient.make(type, room);
    modifyShiftById(shiftId, Shift.addPatient, newPatient);

    const shift = findShiftById(shiftId);

    // if new total > bonus move pointer without pointer event
    // AND movePointer === true
    if (shift.counts.total > shift.bonus && movePointer === true)
      moveRotationPointer(shift.rotationId, 1, "noEvent");

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
    //getSortedState,
    reset: withHistory(reset),
    addNewShift: withHistory(addNewShift),
    moveShiftToRotation: withHistory(moveShiftToRotation),
    moveRotationPointer: withHistory(moveRotationPointer),
    moveShift: withHistory(moveShift),
    assignPatient: withHistory(assignPatient),
    reassignPatient: withHistory(reassignPatient),
    undo,
  };
}

export default createBoardStore;
