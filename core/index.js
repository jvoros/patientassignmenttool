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

/*
MORE THINKING

Each event can hold: current state and pointer to last event. These don't need to be returned to client
No need to return "store" to client. Each shift knows its patients. 

Board object sent to client can be deeply nested
*/
