import Patient from "./patient.js";
import Shift from "./shift.js";
import Rotation from "./rotation.js";
import Timeline from "./timeline.js";

class Board {
  constructor(rotations = []) {
    this.rotations = {}; 
    this.timeline = new Timeline();
    this.initialize();
  }

  addRotation(r) {
    this.rotations[r.name] = r;
  }

  addRotations(rots) {
    if (rots.length == 0) return
    rots.forEach(r => this.addRotation(r));
  }

  initialize() {
    this.addRotations([
      new Rotation('Main', true),
      new Rotation('Fast Track', false),
      new Rotation('Off', false)
    ]);
  }

  reset() {
    this.rotations = {}
    this.timeline = new Timeline();
    this.initialize();
  }

  // SHIFT HANDLERS
  addShiftToRotation(rotation, doctor, options) {
    const s = new Shift(doctor, options);
    this.rotations[rotation].addShift(s);
  }

  moveShiftBetweenRotations(index, from, to) {
    // from and to are rotation names
    const shift = this.rotations[from].removeShift(index);
    this.rotations[to].addShift(shift);
  }

}
export default Board;