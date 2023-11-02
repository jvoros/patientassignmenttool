import { describe, it } from "mocha";
import { expect } from "chai";

import rotation from "../server/controllers/rotation.js";

let main = rotation.make("Main", true);
let ft = rotation.make("Fast Track");

describe("Rotation Functions", () => {
  it("should be created with default properties", () => {
    const comp = ["id", "name", "usePointer", "pointer", "shiftCount"];
    expect(Object.keys(main)).to.deep.equal(comp);
  });

  it("should be created with use_pointer true if flagged", () => {
    expect(main.usePointer).to.equal(true);
  });

  it("should handle pointer", () => {
    main.shiftCount = 3; // pointer 0, 1, 2 for these shifts
    main = rotation.movePointer(main, 1); // points at shift 2, index 1
    main = rotation.movePointer(main, 1); // should point at shift 3, index 2
    expect(main.pointer).to.equal(2);
    // wrap back to zero
    main = rotation.movePointer(main, 1);
    expect(main.pointer).to.equal(0);
    // wrap back to end
    main = rotation.movePointer(main, -1);
    expect(main.pointer).to.equal(2);

    main.shiftCount = 0;

    // doesn't move if usePointer false
    ft = rotation.movePointer(ft, 1);
    expect(ft.pointer).to.equal(0);
  });

  it("should add shifts", () => {
    main = rotation.addShift(main);
    expect(main.shiftCount).to.equal(1);
  });

  describe("removing shifts", () => {
    it("should decrease shift and not change pointer if order > pointer", () => {
      main.pointer = 0;
      main.shiftCount = 2;
      main = rotation.removeShift(main, 1);
      expect(main.pointer).to.equal(0);
      expect(main.shiftCount).to.equal(1); // also decreases shift count
    });
    it("should decrease shift and pointer if order < pointer", () => {
      main.pointer = 2;
      main.shiftCount = 4;
      main = rotation.removeShift(main, 1);
      expect(main.pointer).to.equal(1);
      expect(main.shiftCount).to.equal(3);
    });
    it("should not change pointer if order == pointer and not last", () => {
      main.pointer = 2;
      main.shiftCount = 12;
      main = rotation.removeShift(main, 2);
      expect(main.pointer).to.equal(2);
      expect(main.shiftCount).to.equal(11);
    });
    it("should set pointer to 0 if order is last", () => {
      main.pointer = 3;
      main.shiftCount = 4;
      main = rotation.removeShift(main, 3);
      expect(main.pointer).to.equal(0);
      expect(main.shiftCount).to.equal(3);
    });
  });
});

// describe("# pointer methods", () => {
//   it("should not move pointer if no shifts", () => {
//     main.movePointer(1);
//     expect(main.pointer).to.equal(0);
//   });

//   it("should loop pointer forward and backward if shifts present, and return skip or reverse events", () => {
//     let e;
//     main.shifts = [
//       { name: 1, doctor: { first: "Jeremy", last: "Voros" } },
//       { name: 2, doctor: { first: "Jeremy", last: "Voros" } },
//       { name: 3, doctor: { first: "Jeremy", last: "Voros" } },
//     ]; // can't move pointer unless shifts
//     e = main.movePointer(1);
//     expect(main.pointer).to.equal(1);
//     expect(e.action).to.equal("skip");
//     e = main.movePointer(-1);
//     expect(main.pointer).to.equal(0);
//     expect(e.action).to.equal("reverse");
//     main.movePointer(-1);
//     expect(main.pointer).to.equal(main.shifts.length - 1);
//     main.movePointer(1);
//     expect(main.pointer).to.equal(0);
//   });

//   it("should getPointer 0 if pointer false", () => {
//     ft.shifts = [1, 2, 3];
//     ft.movePointer(1);
//     expect(ft.pointer).to.equal(0);
//   });
// });

// describe("# shift methods", () => {
//   it("should add shifts", () => {
//     main.shifts = [];
//     main.addShift({
//       name: "test",
//       doctor: { first: "Jeremy", last: "Voros" },
//     });
//     expect(main.shifts.length).to.equal(1);
//   });

//   it("should add shifts at pointer", () => {
//     main.addShift({
//       name: "test 2",
//       doctor: { first: "Jeremy", last: "Voros" },
//     });
//     main.movePointer(1);
//     main.addShift({
//       name: "test 3",
//       doctor: { first: "Jeremy", last: "Voros" },
//     });
//     expect(main.shifts[1].name).to.equal("test 3");
//   });

//   it("should remove shifts by index", () => {
//     const removed_shift = main.removeShift(1).removed_shift;
//     expect(removed_shift.name).to.equal("test 3");
//   });

//   it("should not change pointer if removed shift index > pointer", () => {
//     main.shifts = [];
//     main.addShift({
//       name: "test 1",
//       doctor: { first: "Jeremy", last: "Voros" },
//     });
//     main.addShift({
//       name: "test 2",
//       doctor: { first: "Jeremy", last: "Voros" },
//     });
//     main.addShift({
//       name: "test 3",
//       doctor: { first: "Jeremy", last: "Voros" },
//     });
//     main.removeShift(2);
//     expect(main.pointer).to.equal(1);
//   });

//   it("should decrease pointer if removed shift index < pointer", () => {
//     main.removeShift(0);
//     expect(main.pointer).to.equal(0);
//   });

//   it("should not change pointer if index == pointer and not last shift", () => {
//     main.shifts = [];
//     main.addShift({
//       name: "test 1",
//       doctor: { first: "Jeremy", last: "Voros" },
//     });
//     main.addShift({
//       name: "test 2",
//       doctor: { first: "Jeremy", last: "Voros" },
//     });
//     main.addShift({
//       name: "test 3",
//       doctor: { first: "Jeremy", last: "Voros" },
//     });
//     main.movePointer(1);
//     main.removeShift(1);
//     expect(main.pointer).to.equal(1);
//   });

//   it("should reset pointer to 0 if index == pointer and index is last shift", () => {
//     main.shifts = [];
//     const shifts = [
//       { name: "test 1", doctor: { first: "Jeremy", last: "Voros" } },
//       { name: "test 2", doctor: { first: "Kelly", last: "Blake" } },
//       { name: "test 3", doctor: { first: "Brian", last: "Kasavana" } },
//     ].forEach((s) => {
//       main.addShift(s);
//     });
//     main.movePointer(2);
//     main.removeShift(2);
//     expect(main.pointer).to.equal(0);
//   });

//   it("should move shift up in rotation", () => {
//     main.shifts = [];
//     const shifts = [
//       { name: "test 1", doctor: { first: "Jeremy", last: "Voros" } },
//       { name: "test 2", doctor: { first: "Kelly", last: "Blake" } },
//       { name: "test 3", doctor: { first: "Brian", last: "Kasavana" } },
//     ].forEach((s) => {
//       main.addShift(s);
//     });
//     main.moveShift(1, -1);
//     expect(main.shifts[0].name).to.equal("test 2");
//   });

//   it("should move shift to end if first shift moved up", () => {
//     main.shifts = [];
//     const shifts = [
//       { name: "test 1", doctor: { first: "Jeremy", last: "Voros" } },
//       { name: "test 2", doctor: { first: "Kelly", last: "Blake" } },
//       { name: "test 3", doctor: { first: "Brian", last: "Kasavana" } },
//     ].forEach((s) => {
//       main.addShift(s);
//     });
//     main.moveShift(0, -1);
//     expect(main.shifts[main.shifts.length - 1].name).to.equal("test 3");
//   });

//   it("should move shift down in rotation", () => {
//     main.shifts = [];
//     const shifts = [
//       { name: "test 1", doctor: { first: "Jeremy", last: "Voros" } },
//       { name: "test 2", doctor: { first: "Kelly", last: "Blake" } },
//       { name: "test 3", doctor: { first: "Brian", last: "Kasavana" } },
//     ].forEach((s) => {
//       main.addShift(s);
//     });
//     main.moveShift(0, 1);
//     expect(main.shifts[1].name).to.equal("test 3");
//   });

//   it("should move shift to start if last shift moved down", () => {
//     main.shifts = [];
//     const shifts = [
//       { name: "test 1", doctor: { first: "Jeremy", last: "Voros" } },
//       { name: "test 2", doctor: { first: "Kelly", last: "Blake" } },
//       { name: "test 3", doctor: { first: "Brian", last: "Kasavana" } },
//     ].forEach((s) => {
//       main.addShift(s);
//     });
//     main.moveShift(2, 1);
//     expect(main.shifts[0].name).to.equal("test 1");
//   });
// });

// describe("# patient assignment methods", () => {
//   let m = rotation.make("test rotation 3", true);
//   m.addShift(
//     shift.make(
//       { last: "Voros", first: "Jeremy" },
//       { start: "06:00", end: "15:00", name: "6 am", bonus: 2 }
//     )
//   );
//   m.addShift(
//     shift.make(
//       { last: "Rogers", first: "Legrand" },
//       { start: "08:00", end: "15:00", name: "8 am", bonus: 2 }
//     )
//   );

//   it("should assign patients to next shift then return event", () => {
//     const event = m.addPatient("ambo", 20);
//     expect(m.shifts[0].counts.total).to.equal(1);
//     expect(event.doctor.last).to.equal("Rogers");
//   });

//   it("should only advance pointer after bonus met", () => {
//     expect(m.pointer).to.equal(0);
//     m.addPatient("walk-in", 19);
//     expect(m.pointer).to.equal(0);
//     m.addPatient("walk-in", 20);
//     expect(m.pointer).to.equal(1);
//   });
// });

//   it("should set pointer within bounds of shift length", () => {
//     r2 = rotation.setPointer(r2, 2);
//     expect(r2.pointer).to.equal(2);
//     r2 = rotation.setPointer(r2, -1);
//     expect(r2.pointer).to.equal(2);
//     r2 = rotation.setPointer(r2, 10);
//     expect(r2.pointer).to.equal(2);
//   })
// });

//
