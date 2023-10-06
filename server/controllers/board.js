import shift from "./shift.js";
import rotation from "./rotation.js";
import Timeline from "./timeline.js";

// LIFECYCLE
function make() {
  return {
    rotations: {
      "Main": rotation.make('Main', true),
      "Fast Track": rotation.make('Fast Track'),
      "Off": rotation.make("Off")
    },
    timeline: {}
  }
}

function reset() {
  return make();
}

// ROTATION

// utility wrapper for rotation methods that affect one rotation
// see addShiftToRotation function to see how it replaced the repeated code
// see addPatient to see how it used a different transform function
function rotationTransform(board, rotation_name, transform, ...args) {
  return {
    ...board,
    rotations: {
      ...board.rotations,
      [rotation_name]: transform(board.rotations[rotation_name], ...args)
    }
  }
}

function addShiftToBoard(board, rotation_name, doctor, options) {
  return rotationTransform(board, rotation_name, rotation.addShift, shift.make(doctor, options));
  // return {
  //   ...board,
  //   rotations: {
  //     ...board.rotations,
  //     [rotation_name]: rotation.addShift(board.rotations[rotation_name], shift.make(doctor, options)),
  //   },
  // };
}

function moveShiftBetweenRotations(board, index, from_name, to_name) {
  const { removed_shift, new_rotation } = rotation.removeShift(board.rotations[from_name], index);
  return {
    ...board,
    rotations: {
      ...board.rotations,
      [to_name]: rotation.addShift(board.rotations[to_name], removed_shift),
      [from_name]: new_rotation,
    },
  };
}

// PATIENT HANDLERS
function assignPatient(board, type, room) {
  const ft_open = board.rotations['Fast Track'].shifts.length > 0;
  // uses patient type to select appropriate rotation
  const rotationName = type == 'Fast Track' && ft_open ? 'Fast Track' : 'Main';
  return rotationTransform(board, rotationName, rotation.assignPatient, type, room);
}

export default { make, reset, addShiftToBoard, moveShiftBetweenRotations, assignPatient }
