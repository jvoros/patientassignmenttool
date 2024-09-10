import Shift from "./shift-functions.js";
import Rotation from "./rotation-functions.js";

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

  const reset = () => {};

  const undo = () => {};

  return {
    get,
    reset,
    undo,
    addShift: Shift.addShift,
    flexOn: Shift.flexOn,
    flexOff: Shift.flexOff,
    joinFt: Shift.joinFt,
    leaveFt: Shift.leaveFt,
    signOut: Shift.signOut,
    rejoin: Shift.rejoin,
    moveNext: Rotation.moveNext,
    moveShiftInRotation: Rotation.moveShiftInRotation,
  };
};

export default createStore;
