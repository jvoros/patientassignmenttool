const actions = {
  // PATIENT
  newPatient: (type, room) => {
    return ({ 
      type: 'board/new-patient', 
      payload: {type, room }
    })
  },

  moveShiftFromTo: (index, from_rotation_name, to_rotation_name) => {
    return({
      type: 'board/move-shift-between',
      payload: { index, from: from_rotation_name, to: to_rotation_name }
    })
  },

  undo: () => ({ type: 'board/undo' }),

  // ROTATION
  addShift: (doctor = {}, shift_details = {}, rotation_name ='main') => { 
    return ({
      type: 'rotation/add-shift', 
      payload: { rotation_name, args: [doctor, shift_details]}
    })
  },

  movePointer: (rotation_name, offset) => ({ type: 'rotation/move-pointer', payload: { rotation_name, offset }}),

  moveShift: (rotation_name, index, offset) => ({ type: 'rotation/move-shift', payload: {rotation_name, index, offset }})

}

export default actions
