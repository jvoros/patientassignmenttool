import { shortTimestamp } from "./helpers.js";

/*
patient_assignment object
  - rotation        string: rotation name
  - shift_id        string
  - patient_id      string
  - moved_pointer   bool
*/

class BoardEvent {

  constructor(action = '', msg ='', patient_assignment = null) {
    this.time = shortTimestamp();
    this.action = action;
    this.msg = msg;
    this.pt = patient_assignment;
  }

}

export default BoardEvent;