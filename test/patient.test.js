import { describe, it } from "mocha";
import { expect } from "chai";

import patient from '../server/controllers/patient.js'

describe("Patient Class Tests", () => {
  it("should construct correctly", () => {
    const p = patient.make("walk-in", "Triage A");
    expect(p.type).to.equal("walk-in");
    expect(p.room).to.equal("Triage A");
    expect(p.time.length).to.be.greaterThan(6);
  });

});