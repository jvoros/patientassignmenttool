import { describe, it } from "mocha";
import { expect } from "chai";

import Shift from '../server/controllers/shift.js';

describe("Shift Class Tests", () => {
  const s = new Shift({ first: "Jeremy", last: "Voros"}, { start: "06:00", end: "15:00", name: "6am Shift", bonus: 2 });

  it("should construct correctly", () => {
    expect(s.id).to.exist;
    expect(s.doctor.first).to.equal("Jeremy");
    expect(s.doctor.last).to.equal("Voros");
    expect(s.start).to.equal("06:00");
    expect(s.end).to.equal("15:00");
    expect(s.name).to.equal("6am Shift");
    expect(s.bonus).to.equal(2);
    expect(s.patients.length).to.equal(0);
  });

  it("should add patients", () => {
    s.addPatient({ type: "walk"});
    expect(s.patients.length).to.equal(1);
    expect(s.patients[0].type).to.equal("walk");
  });

  it("should be in_bonus until bonus reached", () => {
    // already one patient added from prior test
    // this is patient 2
    s.addPatient({ type: "walk"});
    expect(s.in_bonus).to.equal(true); 
    // patient 3, should be out of bonus
    s.addPatient({ type: "walk"});
    expect(s.in_bonus).to.equal(false);
    // patient 4, should stay out of bonus
    s.addPatient({ type: "walk"});
    expect(s.in_bonus).to.equal(false);
  });

  it("should count patient types", () => {
    s.addPatient({ type: "ambo"});
    s.addPatient({ type: "ambo"});
    s.addPatient({ type: "fasttrack"});
    s.addPatient({ type: "fasttrack"});
    s.addPatient({ type: "zebra"});
    expect(s.counts).to.deep.equal({
      total: 9,
      walk: 4,
      ambo: 2,
      fasttrack: 2,
      zebra: 1
    })
  })

  

});