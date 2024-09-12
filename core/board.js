import Shift from "./shift.js/index.js";
import Rotation from "./rotation.js/index.js";
import Patient from "./patient.js";
import Event from "./event.js/index.js";

/*
Shift Objects
{
info,
provider { last, first},
patients [ids]
supervisor [ids]
}
*/

const board = {
  main: [{}, {}, {}], // array of shift objects
  flex: [], //same
  off: [], //same
  events: [{}], // array of event objects
  nextFt: "shiftId",
  nextProvider: "shiftId",
  nextSupervisor: "shiftId",
};

export const getEmptyState = () => {
  return {
    main: [], // array of shift {id, type}
    flex: [], // array of shift {id, type}
    off: [], // array of shift {id, type}
    events: [], // array of event IDs, limit to 30
    nextFt: "", // shift ID
    nextProvider: "", // shift ID
    nextSupervisor: "", // shift ID
  };
};

export const getEmptyBoard = () => {
  // board is the deeply nested object based on state
};

const createStore = () => {
  let state = getEmptyState();
  let board = getEmptyBoard();

  // never need to get state, board is always based on state
  const get = () => board;

  const reset = async () => {
    const newState = getEmptyState();
    const newStateWithEvent = Event.addToState(newState, "reset");
    const newStore = await db.getBoard(newStateWithEvent);
    state = newStateWithEvent;
    board = newStore;
  };

  // error checking here
  // should catch any error from whole program
  const withRehydrate =
    (fn) =>
    async (...args) => {
      try {
        state = await fn(state, ...args);
        board = await db.getStoreFromState(state);
      } catch (error) {
        console.error("Error during state rehydration:", error);
        throw error;
      }
    };

  return {
    get,
    reset,
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
