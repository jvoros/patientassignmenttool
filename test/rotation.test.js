import { describe, it } from "mocha";
import { expect } from "chai";

import Rotation from '../server/controllers/rotation.js'

describe("Rotation Class Tests", () => {
  const r = new Rotation('test rotation');
  const r2 = new Rotation('test rotation 2', true);
  
  describe("# constructor()", () => {
    it("should be created with default properties", () => {
      const shape = {
        name: 'test rotation',
        use_pointer: false,
        pointer: 0,
        shifts: []
      };
      expect(r).to.deep.equal(shape);
    });

    it("should be created with use_pointer true if flagged", () => {
      const shape2 = {
        name: 'test rotation 2',
        use_pointer: true,
        pointer: 0,
        shifts: []
      };
      expect(r2).to.deep.equal(shape2);
    });
  });

  describe("# pointer methods", () => {
    it("should advancePointer", () => {
      r2.advancePointer();
      expect(r2.pointer).to.equal(1);
    });

    it("shoulder reversePointer", () => {
      r2.reversePointer();
      expect(r2.pointer).to.equal(0);
    });

    it("should getPointer 0 if pointer false", () => {
      r.advancePointer();
      expect(r.getPointer()).to.equal(0);
    });

    it("should getPointer if pointer true", () => {
      r2.advancePointer();
      expect(r2.getPointer()).to.equal(1);
    });

    it("should set pointer", () => {
      r.setPointer(12);
      expect(r.pointer).to.equal(12)
    })
  });

  describe("# shift methods", () => {
    it("should add shifts", () => {
      r2.pointer = 0;
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((x) => r2.addShift({ shift: x}));
      expect(r2.shifts.length).to.equal(10);
    });

    it("should add shifts at pointer", () => {
      r2.advancePointer();
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
      r2.moveShift(1, "up");
      expect(r2.shifts[0].shift).to.equal(9)
    })

    it("should move shift to end if first shift moved up", () => {
      r2.moveShift(0, "up");
      expect(r2.shifts[r2.shifts.length - 1].shift).to.equal(9);
    })

    it("should move shift down in rotation", () => {
      r2.shifts = [];
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((x) => r2.addShift({ shift: x}));
      r2.moveShift(1, "down");
      expect(r2.shifts[2].shift).to.equal(9)
    })

    it("should move shift to start if last shift moved down", () => {
      r2.moveShift(r2.shifts.length - 1, "down");
      expect(r2.shifts[0].shift).to.equal(1)
    })

    it("should get next shift", () => {
      r2.setPointer(3)
      expect(r2.next.shift).to.equal(9);
    })
  });

  describe("# patient assignement methods", () => {
    it("should assign patients to next shift");
    it("should advance pointer after first turn changes");
  })
});