import Shift from "./shift.js";
import Rotation from "./rotation.js";
import Timeline from "./timeline.js";

/**************************
 * 
 * Board Class
 * This serves as state for the whole site.
 * This will be sent with every request for the frontend to display
 * 
 ***************************/

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

  // PATIENT HANDLERS
  fastTrackIsOpen() {
    return this.rotations['Fast Track'].shifts.length > 0;
  }

  assignPatient(type, room) {
    // uses patient type to select appropriate rotation
    const rotationName = type == 'Fast Track' && this.fastTrackIsOpen() ? 'Fast Track' : 'Main';
    this.rotations[rotationName].assignPatient(type, room);
    return;
  }

}
export default Board;