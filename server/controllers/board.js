// use capitalization for controllers
import Rotation from "./rotation.js";
import Shift from "./shift.js";
import Event from "./event.js";
import Patient from "./patient.js";

// export for use in history api
export const EVENT_LIMIT = 50;

const initialState = {
  zones: {
    // arrays of shift IDs, maintains order, shift can be in more than one zone
    rotation: [],
    fasttrack: [],
    flex: [],
    off: [],
  },
  shifts: [],
  events: [],
  next: {
    // shift IDs for who gets next patient or next supervisor role
    patient: null,
    sup: null,
  },
};

function createBoardStore() {
  let state = structuredClone(initialState);
  let history = [];

  function reset() {
    state = structuredClone(initialState);
    addEvent("reset", "Board reset", null);
    return;
  }

  function getState() {
    return state;
  }

  // SHIFT Functions

  function addShift(provider, options) {
    const shift = Shift.make(provider, options);
    state.shifts.push(shift);

    if (shift.app) {
      addAppShift(shift.id);
    } else {
      // add Doc shift
      joinRotation(shift.id, "noevent");
    }

    addZoneEvent(shift.id, "joined board");
    return shift.id;
  }

  function addAppShift(shiftId) {
    // add APP shift to flex
    state.zones.flex.push(shiftId);
    // if no APP on FT, add to FT
    if (state.zones.fasttrack.length === 0) state.zones.fasttrack.push(shiftId);
  }

  // ROTATION Functions

  function joinRotation(shiftId, noevent) {
    const shift = findShiftById(shiftId);
    // if first shift on rotation
    if (state.zones.rotation.length === 0) {
      state.zones.rotation.push(shiftId);
    } else {
      // not first shift on rotation
      const index = state.zones.rotation.findIndex(
        (x) => x === state.next.patient
      );
      state.zones.rotation.splice(index, 0, shiftId);
    }
    // make the new shift next for patient assignment
    state.next.patient = shiftId;
    // make next sup if none set and not APP shift
    if (!state.next.sup && !shift.app) state.next.sup = shiftId;

    if (noevent) return;
    addZoneEvent(shiftId, "joined rotation");
    return;
  }

  function leaveRotation(shiftId) {
    const shift = findShiftById(shiftId);
    // if last doctor can't leave
    if (numberOfDocsOnRotation() < 2 && !shift.app) return;

    // more than one shift on rotation
    if (state.zones.rotation.length >= 2) {
      // move next assignments as needed
      if (state.next.patient === shiftId) moveNext("patient", 1);
      if (state.next.sup === shiftId) moveNext("sup", 1);
      // remove shift from rotation
      state.zones.rotation.splice(findIndex(shiftId), 1);
      return;
    }

    // else last shift on rotation
    state.zones.rotation = [];
    state.next.patient = null;
    state.next.sup = null;
    return;
  }

  function moveShiftInRotation(shiftId, offset) {
    const [index, nextIndex, _nextShiftId] = findIndexAndNeighbor(
      shiftId,
      offset
    );
    // check bounds
    if (nextIndex < 0 || nextIndex >= state.zones.rotation.length) return;
    // move shift
    // https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
    state.zones.rotation.splice(
      nextIndex,
      0,
      state.zones.rotation.splice(index, 1)[0]
    );
    addZoneEvent(shiftId, "changed position");
    return;
  }

  function moveNext(whichNext, offset, noeventparam = false) {
    let noEvent = noeventparam;
    const shiftId = state.next[whichNext];
    const [_index, _nextIndex, nextShiftId] = findIndexAndNeighbor(
      shiftId,
      offset
    );
    // set next to the next shift id
    state.next[whichNext] = nextShiftId;

    // if moving APP, needs to cycle again if next shift is APP
    const nextShift = findShiftById(nextShiftId);
    if (whichNext === "sup" && nextShift.app) {
      noEvent = true;
      moveNext(whichNext, offset, noeventparam);
    }

    // event
    if (noEvent) return;
    const message = [
      nextShift.provider.first,
      nextShift.provider.last,
      whichNext === "sup" ? "set as next supervisor" : "set as up next",
    ].join(" ");
    addEvent("pointer", message);
    return;
  }

  // ZONE Functions

  function signOut(shiftId) {
    // take off rotation with leaveRotation()
    if (state.zones.rotation.includes(shiftId)) {
      leaveRotation(shiftId);
    }
    // take off all zones
    Object.keys(state.zones).forEach((zone) => {
      const filterOut = state.zones[zone].filter((x) => x != shiftId);
      state.zones[zone] = filterOut;
    });
    // add to off zone
    state.zones.off.push(shiftId);
    addZoneEvent(shiftId, "signed out");
  }

  function rejoinRotation(shiftId) {
    const shift = findShiftById(shiftId);
    const filterOut = state.zones.off.filter((x) => x !== shiftId);
    state.zones.off = filterOut;
    if (shift.app) {
      addAppShift(shiftId);
    } else {
      joinRotation(shiftId);
    }
  }

  function appFlexOff(shiftId) {
    leaveRotation(shiftId, "noevent");
    state.zones.flex.push(shiftId);
    addZoneEvent(shiftId, "flexed off");
    return;
  }

  function appFlexOn(shiftId) {
    joinRotation(shiftId, "noevent");
    state.zones.flex = state.zones.flex.filter((x) => x !== shiftId);
    addZoneEvent(shiftId, "flexed on rotation");
    return;
  }

  function joinFT(shiftId) {
    state.zones.fasttrack.push(shiftId);
    addZoneEvent(shiftId, "joined Fast Track");
  }

  function leaveFT(shiftId) {
    state.zones.fasttrack = state.zones.fasttrack.filter((x) => x !== shiftId);
    addZoneEvent(shiftId, "left Fast Track");
  }

  // ASSIGNMENTS

  function assignPatient(shiftId, type, room, advanceRotation = true) {
    const patient = Patient.make(type, room);
    const shift = findShiftById(shiftId);
    const supShiftId = shift.app ? state.next.sup : null;

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
    const supShift = findShiftById(supShiftId);
    const message = `${room} assigned to ${shift.provider.first} ${shift.provider.last}`;
    const eventDetail = supShiftId
      ? `with ${supShift.provider.first} ${supShift.provider.last}`
      : null;
    addEvent("assign", message, shift, patient, eventDetail);
    return;
  }

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

  function findShiftById(shiftId) {
    return state.shifts.find((shift) => shift.id === shiftId);
  }

  function findIndex(shiftId) {
    return state.zones.rotation.findIndex((x) => x === shiftId);
  }

  function findIndexAndNeighbor(shiftId, offset) {
    const index = findIndex(shiftId);
    const len = state.zones.rotation.length;
    const nextIndex = (index + offset + len) % len;
    const nextShiftId = state.zones.rotation[nextIndex];
    return [index, nextIndex, nextShiftId];
  }

  function numberOfDocsOnRotation() {
    return state.zones.rotation.filter((id) => findShiftById(id).app !== true)
      .length;
  }

  function modifyById(arr, itemId, func, ...args) {
    return arr.map((item) => {
      return item.id === itemId ? func(item, ...args) : item;
    });
  }

  function modifyShiftById(shiftId, func, ...args) {
    state.shifts = modifyById(state.shifts, shiftId, func, ...args);
  }

  // HISTORY
  function undo() {
    // shift() removes and returns first array item
    state = JSON.parse(history.shift());
  }

  // limits # of events
  function addEvent(type, message, shift, patient = null, detail = null) {
    state.events = [
      Event.make(type, message, shift, patient, detail),
      ...state.events.slice(0, EVENT_LIMIT),
    ];
  }

  function addZoneEvent(shiftId, msg) {
    const shift = findShiftById(shiftId);
    addEvent("join", `${shift.provider.first} ${shift.provider.last} ${msg}.`);
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
    addShift: withHistory(addShift),
    moveShiftInRotation: withHistory(moveShiftInRotation),
    moveNext: withHistory(moveNext),
    signOut: withHistory(signOut),
    rejoinRotation: withHistory(rejoinRotation),
    appFlexOff: withHistory(appFlexOff),
    appFlexOn: withHistory(appFlexOn),
    joinFT: withHistory(joinFT),
    leaveFT: withHistory(leaveFT),
    assignPatient: withHistory(assignPatient),
    reassignPatient: withHistory(reassignPatient),
    addApp: withHistory(addApp),
    findShiftById,
    undo,
  };
}

export default createBoardStore;
