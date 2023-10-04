import Patient from "./patient.js";
import Shift from "./shift.js";
import Rotation from "./rotation.js";
import Timeline from "./timeline.js";

class Board {
  constructor() {
    this.rotations = [];  // array of rotation objects
    this.timeline = new Timeline();
  }

}
export default Board;