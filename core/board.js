import Shift from "./shift-functions.js";
import Rotation from "./rotation-functions.js";
import Patient from "./patient-functions.js";
import Event from "./event-functions.js";

/*
Shift Objects
{
info,
provider { last, first},
patients [ids]
supervisor [ids]
}
*/

const store = {
  main: [{}, {}, {}], // array of shift objects
  flex: [], //same
  off: [], //same
  events: [{}], // array of event objects
  nextFt: "shiftId",
  nextProvider: "shiftId",
  nextSupervisor: "shiftId",
};

const getEmptyBoard = () => {
  return {
    state: {
      main: [], // array of shift IDs
      flex: [], // array of shift IDs
      off: [], // array of shift IDs
      events: [], // array of event IDs, limit to 30
      nextFt: "", // shift ID
      nextProvider: "", // shift ID
      nextSupervisor: "", // shift ID
    },
    store: {}, // deeply nested, hydrated version of state
  };
};

const createStore = () => {
  let board = getEmptyBoard();

  const get = () => board;

  const withRehydrate =
    (fn) =>
    async (...args) => {
      const newState = await fn(board, ...args);
      const newStore = await db.getStoreFromState(newState);
      board = { state: newState, store: newStore };
    };

  return {
    get,
    reset: withRehydrate(Event.reset),
    undo: withRehydrate(Event.undo),
    addShift: withRehydrate(Shift.addShift),
    flexOn: withRehydrate(Shift.flexOn),
    flexOff: withRehydrate(Shift.flexOff),
    joinFt: withRehydrate(Shift.joinFt),
    leaveFt: withRehydrate(Shift.leaveFt),
    signOut: withRehydrate(Shift.signOut),
    rejoin: withRehydrate(Shift.rejoin),
    moveNext: withRehydrate(Rotation.moveNext),
    moveShiftInRotation: withRehydrate(Rotation.moveShiftInRotation),
    assignPatient: withRehydrate(Patient.assignPatient),
    reassignPatient: withRehydrate(Patient.reassignPatient),
  };
};

export default createStore;
