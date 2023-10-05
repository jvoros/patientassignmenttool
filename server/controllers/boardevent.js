import { shortTimestamp } from "./helpers.js";

class BoardEvent {

  constructor(action = '', msg = '', room = '') {
    this.time = shortTimestamp();
    this.action = action;
    this.msg = msg;
    this.pt = room;
  }

}

export default BoardEvent;