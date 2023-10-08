/**
 * Using actions that trigger function within reducer
 * is nice because it reduces the boilerplate code you 
 * would have to write for each function, e.g produce(...),
 * repeating action.type and action.payload, over and over.
 * 
 * Instead it happens once in reducer. Build the function
 * calls here. Nice and clean.
 * 
 * Also isolates all functions that change state so if
 * only interaction is through the store, all changes
 * being done in stateful way
 * 
 */

const actions = {
  // PATIENT
  newPatient: (type, room) => ({ type: 'board/new-patient', payload: {type, room }}),

  // ROTATION
  addShift: (doctor = {}, shift_details = {}, rotation_name ='main') => { 
    return ({
      type: 'rotation/add-shift', 
      payload: { rotation_name, args: [doctor, shift_details]}
    })
  },

  moveShiftFromTo: (index, from_rotation_name, to_rotation_name) => {
    return({
      type: 'rotation/move-shift-between',
      payload: { index, from: from_rotation_name, to: to_rotation_name }
    })
  },

  movePointer: (rotation_name, offset) => ({ type: 'rotation/move-pointer', payload: { rotation_name, offset }}),

  moveShift: (rotation_name, index, offset) => ({ type: 'rotation/move-shift', payload: {rotation_name, index, offset }}),
  
  // TIMELINE
  addEvent: (text) => ({ type: 'timeline/add-event', payload: text })
}

export default actions