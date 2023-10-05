import Patient from "./patient.js";
import Shift from "./shift.js";
import Rotation from "./rotation.js";
import Timeline from "./timeline.js";

class Board {
  constructor() {
    this.rotations = [
      new Rotation('On', true),
      new Rotation('Fast Track'),
      new Rotation('Off')
    ]; 
    this.timeline = new Timeline();
  }

}
export default Board;