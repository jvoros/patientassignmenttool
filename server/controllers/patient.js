import { randomUUID } from 'crypto'
import { shortTimestamp } from './helpers.js';

class Patient {
  constructor(type, room) {
    this.time = shortTimestamp()  // string
    this.id = randomUUID();       // string UUID
    this.type = type;             // string
    this.room = room;             // string
  }
}

export default Patient;