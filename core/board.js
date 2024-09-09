import Patient from "./patient-functions.js";
import Shift from "./shift-functions.js";
import Rotation from "./rotation-functions.js";

export const getBlankBoard = () => ({
  state: {
    main: [], // array of shift IDs
    ft: [], // array of shift IDs
    flex: [], // array of shift IDs
    off: [], // array of shift IDs
    nextPatient: "", // shift ID
    nextSupervisor: "", // shift ID
    events: [], // array of event IDs,
    patients: [],
  },
  store: {
    shifts: [],
    events: [],
    patients: [],
  },
});

const createBoard = () => {
  let board = getBlankBoard();

  const get = () => board;

  const reset = () => {
    const lastState = board.state;
    board = getBlankBoard();
    board = addEvent("board", "Board reset", lastState);
    return board;
  };

  const undo = () => {};

  return {
    get,
    reset,
    undo,
    addShift: Shift.addShift,
    flexOn: Shift.flexOn,
    flexOff: Shift.flexOff,
    joinFT: Shift.joinFT,
    leaveFT: Shift.leaveFT,
    signOut: Shift.signOut,
    rejoin: Shift.rejoin,
    moveNextPatient: Rotation.moveNextPatient,
    moveNextSupervisor: Rotation.moveNextSupervisor,
    moveShift: Rotation.moveShift,
  };
};

export default createBoard;
