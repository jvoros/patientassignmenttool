import { shortTimestamp } from './helpers.js';

class Patient {
  constructor(type, room) {
    this.time = shortTimestamp()  // string
    this.type = type;             // string
    this.room = room;             // string
  }
}

export default Patient;