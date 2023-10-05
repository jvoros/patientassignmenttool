import { describe, it } from "mocha";
import { expect } from "chai";

import Patient from '../server/controllers/patient.js'

describe("Patient Class Tests", () => {
  const p = new Patient("walk-in", "Triage A");

  it("should construct correctly", () => {
    expect(p.type).to.equal("walk-in");
    expect(p.room).to.equal("Triage A");
    expect(p.time.length).to.be.greaterThan(6);
  });

});