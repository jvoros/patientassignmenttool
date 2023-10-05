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
      bonus_complete: false,
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

  it("should be bonus_complete false until bonus reached", () => {
    // already one patient added from prior test
    // this is patient 2
    s = shift.addPatient(s, { type: "walk"});
    expect(s.bonus_complete).to.equal(false); 
    // patient 3, should be out of bonus
    s = shift.addPatient(s, { type: "walk"});
    expect(s.bonus_complete).to.equal(true);
    // patient 4, should stay out of bonus
    s = shift.addPatient(s, { type: "walk"});
    expect(s.bonus_complete).to.equal(true);
  });

  it("should count patient types", () => {
    s = shift.addPatient(s, { type: "ambo"});
    s = shift.addPatient(s, { type: "ambo"});
    s = shift.addPatient(s, { type: "fasttrack"});
    s = shift.addPatient(s, { type: "fasttrack"});
    s = shift.addPatient(s, { type: "zebra"});
    expect(s.counts).to.deep.equal({
      total: 9,
      walk: 4,
      ambo: 2,
      fasttrack: 2,
      zebra: 1
    });
  })

  

});