import { describe, it } from "mocha";
import { expect } from "chai";

import board from '../server/controllers/board.js'

let main = board.make();

describe("Board Class Tests", () => {

  describe("# lifecycle methods", () => {
    it("should initialize correctly", () => {
      expect(Object.keys(main.rotations)).to.deep.equal(['Main', 'Fast Track', 'Off']);
      expect(main.timeline).to.exist;
    });

    it("should be able to reset rotations", () => {
      main = board.addShiftToBoard(main, "Main", {last: 'Voros', first: 'Jeremy'}, {name: 'Test shift'});
      main = board.reset();
      expect(main.rotations['Main'].shifts.length).to.equal(0)
    });
    it("should be able to reset with Timeline");
  });

  describe("# rotation methods", () => {
    it("should add shifts", () => {
      main = board.addShiftToBoard(main, "Main", {last: "Voros", first: "Jeremy"}, {start: "06:00", end: "15:00", name: "6 am", bonus: 2})
      expect(main.rotations['Main'].shifts[0].doctor.last).to.equal("Voros");
    });

    it("should move shifts between rotations", () => {
      main = board.addShiftToBoard(main, "Main", {last: "Blake", first: "Kelly"}, {start: "06:00", end: "15:00", name: "6 am", bonus: 2})
      main = board.moveShiftBetweenRotations(main, 0, "Main", "Off");
      expect(main.rotations['Main'].shifts.length).to.equal(1);
      expect(main.rotations['Off'].shifts.length).to.equal(1);
    });

    it("should assign patients to main, fasttrack, or fasttrack to main if no fasttrack shift", () => {
      main = board.assignPatient(main, 'Fast Track', 20);
      expect(main.rotations['Main'].shifts[0].counts['Fast Track']).to.equal(1);
      
      main = board.assignPatient(main, 'Walk-In', 4);
      expect(main.rotations['Main'].shifts[0].counts["Walk-In"]).to.equal(1);

      main = board.addShiftToBoard(main, "Fast Track", {last: "Kasavana", first: "Brian"}, {start: "06:00", end: "15:00", name: "6 am", bonus: 2})
      main = board.assignPatient(main, 'Fast Track', 21);
      expect(main.rotations['Fast Track'].shifts[0].counts['Fast Track']).to.equal(1);
      console.log(JSON.stringify(main))
    })
  });

  describe("# timeline methods", () => {
    it("should record patient assignments");
    it("should record shift additions to the board");
    it("should record shift movements between rotations");
    it("should record pointer movement within rotations");
  });
});