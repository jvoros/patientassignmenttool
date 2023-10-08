import shift from './shift.js'
import patient from './patient.js'

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

    addPatient(pt) {
      const updatedShift = this.nextShift().addPatient(pt);
      if (updatedShift.counts.total > updatedShift.bonus) this.movePointer(1);
      return updatedShift.doctor;
    },

    nextShift() { return this.shifts[this.pointer] },

    addShift(shift) {
      this.shifts.splice(this.pointer, 0, shift)
    }, 

    removeShift(index) {
      // if index > pointer, no change to pointer
      // if index < pointer, minus pointer
      // if index == pointer and index not last, no change to pointer
      // if index == pointer and index is last, pointer to 0
      const new_pointer = 
        index < this.pointer ? this.pointer-1 :
        index == this.pointer && index == this.shifts.length-1 ? 0 :
        this.pointer;
      
      this.pointer = new_pointer;
      return this.shifts.splice(index, 1)[0]; // splice will modify shifts array in place
    },

    moveShift(index, offset) {
      const newIndex = (index + offset + this.shifts.length) % this.shifts.length;
      const movedShift = this.shifts.splice(index, 1)[0]; 
      this.shifts.splice(newIndex, 0, movedShift); 
    }
  }
}

export default { make }

// function setPointer(r, new_pointer) {
//   if (new_pointer < 0 || new_pointer > r.shifts.length-1 || r.use_pointer == false) {
//     return r;
//   }
//   return {...r, pointer: new_pointer };
// }

