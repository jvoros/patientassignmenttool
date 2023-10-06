import shift from './shift.js'
import patient from './patient.js'

function make(name, use_pointer = false) {
  return {
    name: name,
    use_pointer: use_pointer,
    pointer: 0,
    shifts: []
  }
}

function setPointer(rotation, new_pointer) {
  if (new_pointer < 0 || new_pointer > rotation.shifts.length-1 || rotation.use_pointer == false) {
    return rotation;
  }
  return {...rotation, pointer: new_pointer };
}

function movePointer(rotation, offset) {
  if (rotation.shifts.length == 0 || rotation.use_pointer == false) {
    return rotation;
  }
  return {
    ...rotation, 
    pointer: (rotation.pointer + offset + rotation.shifts.length) % rotation.shifts.length
  };
}

function addShift(rotation, shift) {
  const new_rotation = {...rotation};
  new_rotation.shifts.splice(rotation.pointer, 0, shift);
  return new_rotation;
}

function removeShift(rotation, index) {
  // if index > pointer, no change to pointer
  // if index < pointer, minus pointer
  // if index == pointer and index not last, no change to pointer
  // if index == pointer and index is last, pointer to 0
  const new_pointer = 
    index < rotation.pointer ? rotation.pointer-1 :
    index == rotation.pointer && index == rotation.shifts.length-1 ? 0 :
    rotation.pointer;

  const new_shifts = [...rotation.shifts];

  return {
    removed_shift: new_shifts.splice(index, 1)[0],
    new_rotation: {
      ...rotation,
      pointer: new_pointer,
      shifts: new_shifts,
    }
  }
}

function moveShift(rotation, index, offset) {
  if (offset === 0) return rotation;

  const newIndex = (index + offset + rotation.shifts.length) % rotation.shifts.length;
  const movedShift = rotation.shifts[index];
  
  const newShifts = [...rotation.shifts]; // Create a copy of the shifts array
  newShifts.splice(index, 1); // Remove the shift from the copy
  newShifts.splice(newIndex, 0, movedShift); // Insert the shift at the new index

  // Create and return a new rotation object with the updated shifts
  return {
    ...rotation,
    shifts: newShifts,
  };
}

function assignPatient(rotation, type, room) {
  let new_rotation = {...rotation};
  const updatedShift = shift.addPatient(rotation.shifts[rotation.pointer], patient.make(type, room));
  new_rotation.shifts[rotation.pointer] = updatedShift;
  return updatedShift.bonus_complete ? movePointer(new_rotation, 1) : new_rotation;
}

export default { make, setPointer, movePointer, addShift, removeShift, moveShift, assignPatient }
