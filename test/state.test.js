import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";

import db from "../src/db.js";
import State from "../src/state.js";

describe("Testing Mocha", () => {
  it("should run the tests", () => {
    expect(2 + 2 == 4).to.be.true;
  });
});

describe("State Class Tests", () => {
  it("should initialize with appropriate properties", (done) => {
    sinon.stub(db, "getShiftDetails");
    db.getShiftDetails.returns([{ name: "6am" }, { name: "8am" }]);

    sinon.stub(db, "getShifts");
    db.getShifts.returns({
      on_rotation: [{ id: 1 }, { id: 2 }],
      off_rotation: [{ id: 3 }],
      ft_rotation: [{ id: 4 }],
    });

    sinon.stub(db, "getDoctors");
    db.getDoctors.returns([{ first: "Jeremy", last: "Voros" }]);

    const d = new Date();
    const state = new State();
    state.initialize().then((r) => {
      expect(r.timeline).to.be.empty;
      expect(r.pointer).to.be.equal(0);
      expect(r.date).to.equal(
        d.toLocaleDateString("fr-CA", { timeZone: "America/Denver" })
      );
      expect(r.shift_details[0]).to.have.keys("name");
      expect(r.shifts).to.have.keys(
        "on_rotation",
        "off_rotation",
        "ft_rotation"
      );
      expect(r.doctors[0]).to.have.keys("first", "last");
      expect(r.initialized).to.equal(true);
      done();
    });
  });
  describe("newAction Method Tests", () => {
    const state = new State();
    state.newAction("patient", "1", "message", "AA", false, false);
    console.log(state.timeline);
    expect(state.timeline[0]).to.have.property("action");
  });
});
