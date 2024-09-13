// functional api base
board.get();
board.reset();
board.undoEvent(event);
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
