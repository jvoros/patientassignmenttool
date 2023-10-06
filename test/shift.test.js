import { describe, it } from "mocha";
import { expect } from "chai";

import shift from '../server/controllers/shift.js';

describe("Shift Class Tests", () => {
  let s = shift.make({ first: "Jeremy", last: "Voros"}, { start: "06:00", end: "15:00", name: "6am Shift", bonus: 2 })
  
  it("should construct correctly", () => {
    const x = {
      doctor: { last: 'Voros', first: 'Jeremy'},
      start: '06:00',
      end: '15:00',
      name: '6am Shift',
      bonus: 2,
      patients: [],
      counts: {}
    }
    expect(s).to.deep.equal(x);
  });

  it("should add patients", () => {
    s = shift.addPatient(s, { type: "walk"});
    expect(s.patients.length).to.equal(1);
    expect(s.patients[0].type).to.equal("walk");
  });

  it("should count patient types", () => {
    [
      { type: "ambo"},
      { type: "ambo"},
      { type: "fasttrack"},
      { type: "fasttrack"},
      { type: "zebra"}
  ].forEach((p) => s = shift.addPatient(s, p))
    expect(s.counts).to.deep.equal({
      total: 6,
      walk: 1,
      ambo: 2,
      fasttrack: 2,
      zebra: 1
    });
  })

});