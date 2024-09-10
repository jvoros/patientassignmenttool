// functional api base
board.get();
board.reset();
board.undo();
board.addShift(provider, schedule);
board.flexOn(shiftId);
board.flexOff(shiftId);
board.joinFt(shiftId);
board.leaveFt(shiftId);
board.signOut(shiftId);
board.rejoin(shiftId);
board.moveNext(whichNext, offset);
board.moveShift(shiftId, offset);
board.assignPatient(shift, type, room, advance);
board.reassignPatient(event, newShift);

/*
API functions all:
- take board as first argument.
- return a new state with new event

use the new state to re-hydrate board.store
*/

/*
MORE THINKING

Each event can hold: current state and pointer to last event. These don't need to be returned to client
No need to return "store" to client. Each shift knows its patients. 

Board object sent to client can be deeply nested

Don't need message for each event. Can generate message based on type.
*/

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
