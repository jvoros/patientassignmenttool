import { describe, it } from "mocha";
import { expect } from "chai";

import board from '../server/controllers/board.js'

const c = {
  doctors: [
    {last: 'Voros', first: 'Jeremy'},
    {last: "Blake", first: "Kelly"},
    {last: "Kasavana", first: "Brian"}
  ],
  shifts: [
    {start: "06:00", end: "15:00", name: "6 am", bonus: 2},
    {start: "08:00", end: "17:00", name: "8 am", bonus: 2},
    {start: "10:00", end: "20:00", name: "10 am", bonus: 2}
  ]
}

let main = board.make();

describe("Board Class Tests", () => {

  describe("# lifecycle methods", () => {
    it("should initialize correctly", () => {
      expect(Object.keys(main.rotations)).to.deep.equal(['Main', 'Fast Track', 'Off']);
      expect(main.timeline).to.exist;
    });

    it("should be able to reset", () => {
      main = board.addShiftToBoard(main, "Main", c.doctors[0], c.shifts[0]);
      main = board.reset();
      expect(main.rotations['Main'].shifts.length).to.equal(0)
    });

  });

  describe("# rotation methods", () => {
    it("should add shifts", () => {
      main = board.addShiftToBoard(main, "Main", c.doctors[0], c.shifts[0])
      expect(main.rotations['Main'].shifts[0].doctor.last).to.equal("Voros");
    });

    it("should move shifts between rotations", () => {
      main = board.addShiftToBoard(main, "Main", c.doctors[1], c.shifts[1])
      main = board.moveShiftFromRotationToRotation(main, 0, "Main", "Off");
      expect(main.rotations['Main'].shifts.length).to.equal(1);
      expect(main.rotations['Off'].shifts.length).to.equal(1);
    });

    it("should assign patients to main, fasttrack, or fasttrack to main if no fasttrack shift", () => {
      main = board.assignPatient(main, 'Fast Track', 20, "Jeremy Voros");
      expect(main.rotations['Main'].shifts[0].counts['Fast Track']).to.equal(1);
      
      main = board.assignPatient(main, 'Walk-In', 4, "Jeremy Voros");
      expect(main.rotations['Main'].shifts[0].counts["Walk-In"]).to.equal(1);

      main = board.addShiftToBoard(main, "Fast Track", c.doctors[2], c.shifts[2])
      main = board.assignPatient(main, 'Fast Track', 21, "Brian Kasavana");
      expect(main.rotations['Fast Track'].shifts[0].counts['Fast Track']).to.equal(1);
    })
  });

  describe("# timeline methods", () => {
    it("should record shift additions to the board", () => {
      main = board.reset()
      main = board.addShiftToBoard(main, "Main", c.doctors[2], c.shifts[0])
      expect(main.timeline.length).to.equal(1);
    });

    it("should record patient assignments", () => {
      main = board.assignPatient(main, 'Walk-In', 20, 'Jeremy Voros')
      expect(main.timeline.length).to.equal(2);
    });
    
    it("should record shift movements between rotations", () => {
      main = board.moveShiftFromRotationToRotation(main, 0, "Main", "Fast Track");
      expect(main.timeline.length).to.equal(3);
    });

    it("should record pointer movement within rotations", () => {
      main = board.reset();
      main = board.addShiftToBoard(main, "Main", c.doctors[0], c.shifts[0]);
      main = board.addShiftToBoard(main, "Main", c.doctors[1], c.shifts[1]);
      main = board.moveRotationPointer(main, "Main", 1);
      main = board.moveRotationPointer(main, "Main", -1);
      expect(main.timeline.length).to.equal(4);
    });
  });
});