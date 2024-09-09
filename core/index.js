// functional api base
board.get();
board.reset();
board.undo();
board.addShift(provider, schedule);
board.flexOn(shiftId);
board.flexOff(shiftId);
board.joinFT(shiftId);
board.leaveFT(shiftId);
board.signOut(shiftId);
board.rejoin(shiftId);
board.moveNextPatient(offset);
board.moveNextSupervisor(offset);
board.moveShift(shiftId, offset);

board.assignPatient(patient);
board.reassignPatient(patientId, newShiftId);

// with supabase
const getBlankBoard = () => ({
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

// v2
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
