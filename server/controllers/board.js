import event from "./event.js"
import rotation from "./rotation.js"
import shift from "./shift.js"

// LIFECYCLE
function make() {
  return {
    rotations: {
      "Main": rotation.make('Main', true),
      "Fast Track": rotation.make('Fast Track'),
      "Off": rotation.make("Off")
    },
    timeline: []
  }
}

function reset() {
  return make();
}

// TIMELINE
function boardWithEvent(board, action, rotation, doctor, msg = '') {
  return {
    ...board,
    timeline: [
      event.make(action, rotation, doctor, msg = ''),
      ...board.timeline.slice(0,50)
    ]
  }
}

// ROTATIONS & SHIFTS

// utility wrapper for rotation methods that affect one rotation
// see addShiftToRotation function to see how it replaced the repeated code
// see addPatient to see how it used a different transform function
function updateRotationInBoard(board, rotation_name, func, ...args) {
  return {
    ...board,
    rotations: {
      ...board.rotations,
      [rotation_name]: func(board.rotations[rotation_name], ...args)
    }
  }
}

function addShiftToBoard(board, rotation_name, doctor, options) {
  const new_board = boardWithEvent(board, 'join', rotation_name, doctor)
  return updateRotationInBoard(new_board, rotation_name, rotation.addShift, shift.make(doctor, options));
  // return {
  //   ...board,
  //   rotations: {
  //     ...board.rotations,
  //     [rotation_name]: rotation.addShift(board.rotations[rotation_name], shift.make(doctor, options)),
  //   },
  // };
}

function moveShiftFromRotationToRotation(board, index, from_name, to_name) {
  const { removed_shift, new_rotation } = rotation.removeShift(board.rotations[from_name], index);
  const new_board = boardWithEvent(board, 'join', to_name, removed_shift.doctor);
  return {
    ...new_board,
    rotations: {
      ...board.rotations,
      [to_name]: rotation.addShift(board.rotations[to_name], removed_shift),
      [from_name]: new_rotation,
    },
  };
}

function moveRotationPointer(board, rotation_name, offset) {
  const r = board.rotations[rotation_name]
  const doctor = r.shifts[r.pointer].doctor;
  const new_board = boardWithEvent(board, offset > 0 ? 'skip' : 'back from', rotation_name, doctor);
  return updateRotationInBoard(new_board, rotation_name, rotation.movePointer, offset);
}

// PATIENT HANDLERS
function assignPatient(board, type, room, doctor) {
  const ft_open = board.rotations['Fast Track'].shifts.length > 0;
  // uses patient type to select appropriate rotation
  const rotationName = type == 'Fast Track' && ft_open ? 'Fast Track' : 'Main';
  const new_board = boardWithEvent(board, type, rotationName, doctor, room)
  return updateRotationInBoard(new_board, rotationName, rotation.assignPatient, type, room);
}

export default { 
  make, 
  reset, 
  addShiftToBoard, 
  moveShiftFromRotationToRotation, 
  moveRotationPointer,
  assignPatient, 
}
