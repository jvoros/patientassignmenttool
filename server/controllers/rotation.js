import shift from './shift.js'
import patient from './patient.js'

// Rotation Functions
// every function after make will have rotation as first arg
// r = rotation

function make(name, use_pointer = false) {
  return {
    name: name,
    use_pointer: use_pointer,
    pointer: 0,
    shifts: [],
    movePointer(offset) {
      if (this.shifts.length == 0 || this.use_pointer == false) return;
      this.pointer = (this.pointer + offset + this.shifts.length) % this.shifts.length;
    },
    nextShift() { return this.shifts[this.pointer] },
    addPatient(pt) {
      const updatedShift = this.nextShift().addPatient(pt);
      if (updatedShift.counts.total > updatedShift.bonus) this.movePointer(1);
    }
  }
}

function setPointer(r, new_pointer) {
  if (new_pointer < 0 || new_pointer > r.shifts.length-1 || r.use_pointer == false) {
    return r;
  }
  return {...r, pointer: new_pointer };
}

function movePointer(r, offset) {
  if (r.shifts.length == 0 || r.use_pointer == false) {
    return r;
  }
  return {
    ...r, 
    pointer: (r.pointer + offset + r.shifts.length) % r.shifts.length
  };
}

function addShift(r, shift) {
  // const new_r = {...r};
  // new_r.shifts.splice(r.pointer, 0, shift);
  // return new_r;
}

function removeShift(r, index) {
  // if index > pointer, no change to pointer
  // if index < pointer, minus pointer
  // if index == pointer and index not last, no change to pointer
  // if index == pointer and index is last, pointer to 0
  const new_pointer = 
    index < r.pointer ? r.pointer-1 :
    index == r.pointer && index == r.shifts.length-1 ? 0 :
    r.pointer;

  const new_shifts = [...r.shifts];
  
  return {
    removed_shift: new_shifts.splice(index, 1)[0],
    new_rotation: {
      ...r,
      pointer: new_pointer,
      shifts: new_shifts,
    }
  }
}

function moveShift(r, index, offset) {
  const newIndex = (index + offset + r.shifts.length) % r.shifts.length;
  const newShifts = [...r.shifts]; 
  const movedShift = newShifts.splice(index, 1)[0]; 
  newShifts.splice(newIndex, 0, movedShift); 

  return {
    ...r,
    shifts: newShifts,
  };
}

function assignPatient(r, type, room) {
  const updatedShift = shift.addPatient(r.shifts[r.pointer], patient.make(type, room));
  let new_r = {...r};
  new_r.shifts[r.pointer] = updatedShift;
  return updatedShift.counts.total > updatedShift.bonus ? movePointer(new_r, 1) : new_r;
}

export default { make, setPointer, movePointer, addShift, removeShift, moveShift, assignPatient }
