import Patient from './patient.js'

class Rotation {
  
  constructor(name, use_pointer = false) {
    this.name = name;               // string
    this.use_pointer = use_pointer; // bool
    this.pointer = 0;               // int
    this.shifts = [];               // array of shift objects
  }

  // POINTER
  // if rotation uses pointer, will return pointer, else default to 0
  getPointer() {
    return this.use_pointer ? this.pointer : 0;
  }

  setPointer(index) {
    if (index < 0 || index > this.shifts.length-1) return;
    this.pointer = index; 
  }

  movePointer(x) {
    if (this.shifts.length == 0) return; 
    this.pointer = (this.pointer + x + this.shifts.length) % this.shifts.length;
  }

  // SHIFTS
  get next() {
    return this.shifts[this.getPointer()];
  }

  addShift(shift) {
    this.shifts.splice(this.getPointer(), 0, shift);
    return this;
  }

  removeShift(index) {
    // if index > pointer, no change to pointer
    // if index < pointer, minus pointer
    // if index == pointer and index not last, no change to pointer
    // if index == pointer and index is last, pointer to 0

    if (index < this.pointer) this.pointer = this.pointer - 1;
    if (index == this.pointer && index == this.shifts.length - 1) this.pointer = 0;
    return this.shifts.splice(index, 1)[0];
  }

  moveShift(index, offset) {
    if (offset === 0) return this;
    const newIndex = (index + offset + this.shifts.length) % this.shifts.length;
    const movedShift = this.shifts.splice(index, 1)[0];
    this.shifts.splice(newIndex, 0, movedShift);
    return this;
  }

  // PATIENTS
  assignPatient(type, room) {
    const p = new Patient(type, room);
    const updatedShift = this.next.addPatient(p);
    if (updatedShift.bonus_complete) this.movePointer(1);
  }

}

export default Rotation;