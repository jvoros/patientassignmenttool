import { applyPatches, produce } from 'immer'
import shift from '../controllers/shift.js'
import patient from '../controllers/patient.js'
import event from '../controllers/event.js'

// timeline limiter
function addEvent(timeline, event) {
  const TIMELINE_LIMIT =  50;
  return ([event, ...timeline.slice(0, TIMELINE_LIMIT)]);
}

function reducer(state, action, undoes) {
  return produce(state, draft => {
    switch (action.type) {

      // BOARD EVENTS      
      case 'board/new-patient':
        // ft pts to ft rotation, all others to main
        const rot = action.payload.type === 'ft' ? 'ft' : 'main';
        const pt = patient.make(action.payload.type, action.payload.room);
        const add_patient_event = draft.rotations[rot].shifts.length > 0 ? 
          draft.rotations[rot].addPatient(pt) : 
          draft.rotations.main.addPatient(pt);
        draft.timeline = addEvent(draft.timeline, add_patient_event);
        return

      case 'board/move-shift-between':
        const { index, from, to } = action.payload;
        const { removed_shift, removed_event } = draft.rotations[from].removeShift(index);
        const move_to_event = draft.rotations[to].addShift(removed_shift);
        draft.timeline = addEvent(
          draft.timeline, 
          event.make('move', 
            move_to_event.rotation, 
            move_to_event.doctor, 
            'Left '+ removed_event.rotation+' and joined '+ move_to_event.rotation
            ));
        return

      case 'board/undo':
        return applyPatches(draft, undoes.getLastUndo());
      
      // ROTATION EVENTS
      case 'rotation/add-shift':
        const new_shift = shift.make(...action.payload.args);
        const add_shift_event = draft.rotations[action.payload.rotation_name].addShift(new_shift);
        draft.timeline = addEvent(draft.timeline, add_shift_event);
        return

      case 'rotation/move-shift':
        const shift_index = action.payload.index;
        const shift_offset = action.payload.offset;
        const move_shift_event = draft.rotations[action.payload.rotation_name].moveShift(shift_index, shift_offset);
        draft.timeline = addEvent(draft.timeline, move_shift_event);
        return

      case 'rotation/move-pointer':
        const { rotation_name, offset } = action.payload;
        const move_pointer_event = draft.rotations[rotation_name].movePointer(offset);
        draft.timeline = addEvent(draft.timeline, move_pointer_event);
        return
    }
  }, 
  (patches, inversePatches) => {
    undoes.addUndo(patches, inversePatches);
  });
};

export default reducer;
