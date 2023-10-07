/**
 * Using actions that trigger function within reducer
 * is nice because it reduces the boilerplate code you 
 * would have to write for each function, e.g produce(...),
 * repeating action.type and action.payload, over and over.
 * 
 * Instead it happens once in reducer. Build the function
 * calls here. Nice and clean.
 */

const actions = {
  // PATIENT
  newPatient: (type, room) => ({ type: 'board/new-patient', payload: [type, room]}),

  // ROTATION
  addShift: (doctor = {}, shift_details = {}, rotation_name ='main') => { 
    return ({
      type: 'rotation/add-shift', 
      payload: { rotation_name, args: [doctor, shift_details]}
    })
  },

  moveShiftFromTo: (index, from_rotation_name, to_rotation_name) => {
    return({
      type: 'rotation/move-shift',
      payload: { index, from: from_rotation_name, to: to_rotation_name }
    })
  },
  
  // TIMELINE
  addEvent: (text) => ({ type: 'timeline/add-event', payload: text })
}

export default actions