import { describe, it } from "mocha";
import { expect } from "chai";

import rotation from '../server/controllers/rotation.js'
import shift from '../server/controllers/shift.js'

describe("Rotation Class Tests", () => {
  let r = rotation.make('test rotation');
  let r2 = rotation.make('test rotation 2', true)
  
  describe("# constructor()", () => {
    it("should be created with default properties", () => {
      const comp = {
        name: 'test rotation',
        use_pointer: false,
        pointer: 0,
        shifts: []
      }
      expect(r).to.deep.equal(comp);
    });

    it("should be created with use_pointer true if flagged", () => {
      expect(r2.use_pointer).to.equal(true);
    });
  });

  describe("# pointer methods", () => {
    it("should not move pointer if no shifts", () => {
      r2 = rotation.movePointer(r2, 1);
      expect(r2.pointer).to.equal(0);
    });
    it("should loop pointer forward and backward if shifts present", () => {
      r2.shifts = [1,2,3]; // can't move pointer unless shifts
      r2 = rotation.movePointer(r2, 1);
      expect(r2.pointer).to.equal(1);
      r2 = rotation.movePointer(r2, -1);
      expect(r2.pointer).to.equal(0);
      r2 = rotation.movePointer(r2, -1);
      expect(r2.pointer).to.equal(r2.shifts.length-1);
      r2 = rotation.movePointer(r2, 1);
      expect(r2.pointer).to.equal(0);
    });

    it("should getPointer 0 if pointer false", () => {
      r.shifts = [1,2,3]; 
      r = rotation.movePointer(r, 1);
      expect(r.pointer).to.equal(0);
    });

    it("should getPointer if pointer true", () => {
      r2 = rotation.movePointer(r2, 1);
      expect(r2.pointer).to.equal(1);
    });

    it("should set pointer within bounds of shift length", () => {
      r2 = rotation.setPointer(r2, 2);
      expect(r2.pointer).to.equal(2);
      r2 = rotation.setPointer(r2, -1);
      expect(r2.pointer).to.equal(2);
      r2 = rotation.setPointer(r2, 10);
      expect(r2.pointer).to.equal(2);
    })
  });

  describe("# shift methods", () => {
    let r3 = rotation.make('test rotation for shift methods', true);
   
    it("should add shifts", () => {
      r3 = rotation.addShift(r3, {name: 'test'});
      expect(r3.shifts.length).to.equal(1);
    });

    it("should add shifts at pointer", () => {
      r3 = rotation.addShift(r3, {name: 'test 2'});
      r3 = rotation.setPointer(r3, 1)
      r3 = rotation.addShift(r3, { name: 'test 3' });
      expect(r3.shifts[1].name).to.equal('test 3')
    })

    it("should remove shifts by index", () => {
      const { removed_shift, new_rotation } = rotation.removeShift(r3, 1);
      expect(removed_shift).to.deep.equal({name: 'test 3'});
    });

    it("should not change pointer if removed shift index > pointer", () => {
      const { removed, new_rotation } = rotation.removeShift(r3, 2);
      expect(new_rotation.pointer).to.equal(1);
    })

    it("should decrease pointer if removed shift index < pointer", () => {
      const { removed, new_rotation } = rotation.removeShift(r3, 0);
      expect(new_rotation.pointer).to.equal(0);
    });

    it("should not change pointer if index == pointer and not last shift", () => {
      const { removed, new_rotation } = rotation.removeShift(r3, 1);
      expect(new_rotation.pointer).to.equal(1);
    });

    it("should reset pointer to 0 if index == pointer and index is last shift", () => {
      r3 = rotation.setPointer(r3, 2);
      const { removed, new_rotation } = rotation.removeShift(r3, 2);
      expect(new_rotation.pointer).to.equal(0);
    });

    it("should move shift up in rotation", () => {
      const new_rotation = rotation.moveShift(r3, 1, -1)
      expect(new_rotation.shifts[0].name).to.equal('test 3')
    })

    it("should move shift to end if first shift moved up", () => {
      const new_rotation = rotation.moveShift(r3, 0, -1)
      expect(new_rotation.shifts[new_rotation.shifts.length - 1].name).to.equal('test 2');
    })

    it("should move shift down in rotation", () => {
      const new_rotation = rotation.moveShift(r3, 0, 1)
      expect(new_rotation.shifts[1].name).to.equal('test 2')
    })

    it("should move shift to start if last shift moved down", () => {
      const new_rotation = rotation.moveShift(r3, 2, 1)
      expect(new_rotation.shifts[0].name).to.equal('test')
    })
  });

  describe("# patient assignment methods", () => {
    let r = rotation.make('test rotation 3', true);
    r = rotation.addShift(r, shift.make({last: "Voros", first: "Jeremy"},{start: "06:00", end: "15:00", name: "6 am", bonus: 2}));
    r = rotation.addShift(r, shift.make({last: "Rogers", first: "Legrand"},{start: "08:00", end: "15:00", name: "8 am", bonus: 2}))
    
    it("should assign patients to next shift", () => {
      r = rotation.assignPatient(r, 'ambo', 20);
      expect(r.shifts[0].counts.total).to.equal(1);
    });

    it("should only advance pointer after bonus met", () => {
      expect(r.pointer).to.equal(0);
      r = rotation.assignPatient(r, 'walk-in', 19);
      expect(r.pointer).to.equal(0);
      r = rotation.assignPatient(r, 'walk-in', 20);
      expect(r.pointer).to.equal(1);
    });
  })
});