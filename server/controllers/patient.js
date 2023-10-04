import { randomUUID } from 'crypto'

class Patient {
  constructor(type, room) {
    const timestamp = new Date();
    this.time = timestamp.toLocaleString("en-US", {
      timeZone: "America/Denver",
      timeStyle: "short",
    })                            // string
    this.id = randomUUID();       // string UUID
    this.type = type;             // string
    this.room = room;             // string
  }
}

export default Patient;