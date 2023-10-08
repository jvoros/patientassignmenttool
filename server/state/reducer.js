import { produce } from "immer"
import shift from "../controllers/shift.js"
import patient from "../controllers/patient.js"
import event from "../controllers/event.js"

// timeline limiter
function addEvent(timeline, event) {
  const TIMELINE_LIMIT =  50;
  return [
    event,
    ...timeline.slice(0, TIMELINE_LIMIT)
  ]
}

const reducer = produce((draft, action) => {
  switch (action.type) {

      case "board/new-patient":
        // ft pts to ft rotation, all others to main
        const rot = action.payload.type === 'ft' ? 'ft' : 'main';
        const pt = patient.make(action.payload.type, action.payload.room);

        let d;
        if (draft.rotations[rot].shifts.length > 0) { 
          d = draft.rotations[rot].addPatient(pt);
        } else {
          d = draft.rotations.main.addPatient(pt);
        }

        const new_patient_event = event.make(action.payload.type, rot, d, 'Room '+action.payload.room);
        draft.timeline = addEvent(draft.timeline, new_patient_event)

        return
      
      case "rotation/add-shift":
        const new_shift = shift.make(...action.payload.args);
        draft.rotations[action.payload.rotation_name].addShift(new_shift);
        const add_shift_event = event.make('join', action.payload.rotation_name, new_shift.doctor, 'Joined')
        draft.timeline = addEvent(draft.timeline, add_shift_event);
        return

      case "rotation/move-shift-between":
        const { index, from, to } = action.payload;
        const moved_shift = draft.rotations[from].removeShift(index);
        draft.rotations[to].addShift(moved_shift)
        return

      case "rotation/move-pointer":
        const { rotation_name, offset } = action.payload;
        draft.rotations[rotation_name].movePointer(offset);
        return

      case "rotation/move-shift":
        const shift_index = action.payload.index;
        const shift_offset = action.payload.offset;
        draft.rotations[action.payload.rotation_name].moveShift(shift_index, shift_offset);
        return


      case "renameUser":
          // OK: we modify the current state
          draft.users[action.payload.id].name = action.payload.name
          return draft // same as just 'return'
      case "loadUsers":
          // OK: we return an entirely new state
          return action.payload
      case "adduser-1":
          // NOT OK: This doesn't do change the draft nor return a new state!
          // It doesn't modify the draft (it just redeclares it)
          // In fact, this just doesn't do anything at all
          draft = {users: [...draft.users, action.payload]}
          return
      case "adduser-2":
          // NOT OK: modifying draft *and* returning a new state
          draft.userCount += 1
          return {users: [...draft.users, action.payload]}
      case "adduser-3":
          // OK: returning a new state. But, unnecessary complex and expensive
          return {
              userCount: draft.userCount + 1,
              users: [...draft.users, action.payload]
          }
      case "adduser-4":
          // OK: the immer way
          draft.userCount += 1
          draft.users.push(action.payload)
          return
  }
});

export default reducer;