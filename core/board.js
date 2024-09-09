import Patient from "./patient-functions.js";
import Shift from "./shift-functions.js";
import Rotation from "./rotation-functions.js";

const getEmptyState = () => {
  return {
    main: [], // array of shift IDs
    flex: [], // array of shift IDs
    off: [], // array of shift IDs
    events: [], // array of event IDs, limit to 30
    ft: "", // shift ID
    next: "", // shift ID
    super: "", // shift ID
  };
};

const createBoard = () => {
  let board = {};

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
