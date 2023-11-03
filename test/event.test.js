import { describe, it } from "mocha";
import { expect } from "chai";

import Event from "../server/controllers/event.js";

const shift = {
  start: "06:00",
  end: "15:00",
  name: "6 am",
  bonus: 2,
  doctor: { last: "Voros", first: "Jeremy" },
};

const pt = {
  type: "ambo",
  room: "20",
};

let e = Event.make("assign", "Assigned to " + shift.doctor.last, shift, pt);

describe("Event Functions", () => {
  it("should construct correctly", () => {
    expect(e.id.length).to.equal(6);
    expect(e.time).to.exist;
    expect(e.type).to.equal("assign");
    expect(e.shift.doctor.last).to.equal("Voros");
    expect(e.message).to.exist;
    expect(e.patient.room).to.equal("20");
  });

  it("should reassign", () => {
    e = Event.setReassign(e, "Bugs Bunny");
    expect(e.reassign).to.equal("Bugs Bunny");
  });
});
