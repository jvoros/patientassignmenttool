import { describe, it } from "mocha";
import { expect } from "chai";

import Rotation from '../server/controllers/rotation.js'

describe("Rotation Class Tests", () => {
  const r = new Rotation('test rotation');
  [1, 2, 3].forEach((x) => r.addShift({ shift: x}));
  const r2 = new Rotation('test rotation 2', true);
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((x) => r2.addShift({ shift: x}));
  
  describe("# constructor()", () => {
    it("should be created with default properties", () => {
      expect(r.name).to.equal('test rotation');
      expect(r.use_pointer).to.equal(false);
      expect(r.pointer).to.equal(0);
      expect(r.shifts).to.exist;
      expect(r.id).to.exist;
    });

    it("should be created with use_pointer true if flagged", () => {
      expect(r2.use_pointer).to.equal(true);
    });
  });

  describe("# pointer methods", () => {
    it("should loop pointer forward and backward", () => {
      r2.movePointer(1);
      expect(r2.pointer).to.equal(1);
      r2.movePointer(-1);
      expect(r2.pointer).to.equal(0);
      r2.movePointer(-1);
      expect(r2.pointer).to.equal(r2.shifts.length-1);
      r2.movePointer(1);
      expect(r2.pointer).to.equal(0);
    });

    it("should getPointer 0 if pointer false", () => {
      r.movePointer(1);
      expect(r.getPointer()).to.equal(0);
    });

    it("should getPointer if pointer true", () => {
      r2.movePointer(1);
      expect(r2.getPointer()).to.equal(1);
    });

    it("should set pointer within bounds of shift length", () => {
      r2.setPointer(9);
      expect(r2.pointer).to.equal(9);
      r2.setPointer(-1);
      expect(r2.pointer).to.equal(9);
      r2.setPointer(10);
      expect(r2.pointer).to.equal(9);
    })
  });

  describe("# shift methods", () => {
    it("should add shifts", () => {
      r2.pointer = 0;
      expect(r2.shifts.length).to.equal(10);
    });

    it("should add shifts at pointer", () => {
      r2.movePointer(1);
      r2.addShift({ shift: 11 });
      expect(r2.shifts[1].shift).to.equal(11)
    })

    it("should remove shifts by index", () => {
      const removed = r2.removeShift(1);
      expect(removed).to.deep.equal({shift: 11});
    });

    it("should not change pointer if removed shift index > pointer", () =>{
      const removed = r2.removeShift(9);
      expect(r2.getPointer()).to.equal(1);
    })

    it("should decrease pointer if removed shift index < pointer", () => {
      const remove = r2.removeShift(0);
      expect(r2.getPointer()).to.equal(0);
    });

    it("should not change pointer if index == pointer and not last shift", () => {
      r2.pointer = 2;
      const removed = r2.removeShift(2);
      expect(r2.getPointer()).to.equal(2);
    });

    it("should reset pointer to 0 if index == pointer and index is last shift", () => {
      r2.pointer = r2.shifts.length - 1;
      const removed = r2.removeShift(r2.shifts.length - 1);
      expect(r2.getPointer()).to.equal(0);
    });

    it("should move shift up in rotation", () => {
      r2.shifts = [];
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((x) => r2.addShift({ shift: x}));
      r2.moveShift(1, -1);
      expect(r2.shifts[0].shift).to.equal(9)
    })

    it("should move shift to end if first shift moved up", () => {
      r2.moveShift(0, -1);
      expect(r2.shifts[r2.shifts.length - 1].shift).to.equal(9);
    })

    it("should move shift down in rotation", () => {
      r2.shifts = [];
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((x) => r2.addShift({ shift: x}));
      r2.moveShift(1, 1);
      expect(r2.shifts[2].shift).to.equal(9)
    })

    it("should move shift to start if last shift moved down", () => {
      r2.moveShift(r2.shifts.length - 1, 1);
      expect(r2.shifts[0].shift).to.equal(1)
    })

    it("should get next shift", () => {
      r2.setPointer(3)
      expect(r2.next.shift).to.equal(9);
    })
  });

  describe("# patient assignment methods", () => {
    it("should assign patients to next shift");
    it("should advance pointer after first turn changes");
  })
});