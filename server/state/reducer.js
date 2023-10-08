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
        const d = draft.rotations[rot].shifts.length > 0 ? 
          draft.rotations[rot].addPatient(pt) : 
          draft.rotations.main.addPatient(pt)
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
  }

});

export default reducer;
