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
    this.pointer = index;
  }

  advancePointer() {
    this.pointer = this.pointer + 1;
  }

  reversePointer() {
    this.pointer = this.pointer - 1;
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

  moveShift(index, dir) {
    const movedShift = this.shifts.splice(index, 1)[0]; // decreases shifts.length by 1
    let newIndex;
    if (dir == "up") {
      // if first element, moving up, move to end, otherwise decrease index
      newIndex = index == 0 ? this.shifts.length : index - 1;
    } else {
      // if last element, moving down, move to start, otherwise increase index 
      // first splice decreased shifts.length by one, don't need to adjust with -1
      newIndex = index == this.shifts.length ? 0 : index + 1
    }
    this.shifts.splice(newIndex, 0, movedShift);
    return this;
  }

}

export default Rotation;