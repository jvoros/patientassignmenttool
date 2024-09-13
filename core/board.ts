import Shift from "./shift";
import Rotation from "./rotation";
import Patient from "./patient";
import Event from "./event";
import db from "./db";

const getEmptyBoard = (): Board => ({
  main: [],
  flex: [],
  off: [],
  events: [],
  nextFt: null,
  nextProvider: null,
  nextSupervisor: null,
});

export const getEmptyState = (): State => {
  return {
    main: [],
    flex: [],
    off: [],
    events: [],
    nextFt: null,
    nextProvider: null,
    nextSupervisor: null,
  };
};

const createStore = () => {
  let state = getEmptyState();
  let board = getEmptyBoard();

  // never need to get state, board is always based on state
  const get = (): Board => board;

  const reset = async () => {
    const newState = getEmptyState();
    const newStateWithEvent = await Event.addToState(newState, {
      type: "reset",
    });
    const newBoard = await db.getBoard(newStateWithEvent);
    state = newStateWithEvent;
    board = newBoard;
  };

  // error checking here
  // should catch any error from whole program
  const withRehydrate =
    (fn: any) =>
    async (...args: any) => {
      try {
        state = await fn(state, ...args);
        board = await db.getBoard(state);
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
