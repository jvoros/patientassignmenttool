import { describe, it } from "mocha";
import { expect } from "chai";

import createBoardStore from "../server/controllers/board.js";

let board = createBoardStore();

const c = {
  providers: [
    { last: "Voros", first: "Jeremy" },
    { last: "Blake", first: "Kelly" },
    { last: "Kasavana", first: "Brian", app: true },
    { last: "Pierson", first: "Emily", app: true },
  ],
  shifts: [
    {
      name: "6 am",
      bonus: 2,
    },
    {
      name: "8 am",
      bonus: 2,
    },
    {
      name: "8 am APP",
      bonus: 0,
      app: true,
    },
    {
      name: "10 am",
      bonus: 2,
    },
    {
      name: "8 pm",
      bonus: 0,
      app: true,
    },
  ],
};

describe("Board Functions", () => {
  describe("Intializing & Moving Shifts", () => {
    it("should initialize correctly", () => {
      expect(Object.keys(board.getState())).to.deep.equal([
        "zones",
        "shifts",
        "events",
        "next",
      ]);
    });

    it("should add shifts", () => {
      board.addShift(c.providers[0], c.shifts[0]); // voros
      board.addShift(c.providers[1], c.shifts[1]); // blake
      board.addShift(c.providers[2], c.shifts[2]); // kasavana,app shift

      expect(board.getState().shifts.length).to.equal(3);
    });

    it("should add doc shifts to rotation, APP shifts to flex", () => {
      expect(board.getState().zones.rotation.length).to.equal(2);
      expect(board.getState().zones.flex.length).to.equal(1);
    });

    it("should set next.patient to most recently add shift doc", () => {
      expect(board.getState().next.patient).to.equal(
        board.getState().shifts[1].id
      );
    });

    it("should set next.sup to first added doc", () => {
      expect(board.getState().next.sup).to.equal(board.getState().shifts[0].id);
    });

    it("should move next patient shift forward and backward", () => {
      board.moveNext("patient", 1); // moves from blake to voros
      expect(board.getState().next.patient).to.equal(
        board.getState().shifts[0].id
      );
      board.moveNext("patient", 1); // moves from voros to blake
      expect(board.getState().next.patient).to.equal(
        board.getState().shifts[1].id
      );
      board.moveNext("patient", -1);
      expect(board.getState().next.patient).to.equal(
        board.getState().shifts[0].id
      );
      board.moveNext("patient", -1);
      expect(board.getState().next.patient).to.equal(
        board.getState().shifts[1].id
      );
    });

    it("should move shifts within rotations", () => {
      // two shifts in rotation, this is first shift
      const firstShiftId = board.getState().zones.rotation[0];
      // move up
      board.moveShiftInRotation(firstShiftId, 1);
      expect(board.getState().zones.rotation[1]).to.equal(firstShiftId);

      // back around from last spot
      board.moveShiftInRotation(firstShiftId, 1);
      expect(board.getState().zones.rotation[0]).to.equal(firstShiftId);

      // back around from first spot
      board.moveShiftInRotation(firstShiftId, -1);
      expect(board.getState().zones.rotation[1]).to.equal(firstShiftId);

      // move down
      board.moveShiftInRotation(firstShiftId, -1);
      expect(board.getState().zones.rotation[0]).to.equal(firstShiftId);
    });

    it("should let APP flex on rotation", () => {
      board.appFlexOn(board.getState().zones.flex[0]);
      expect(board.getState().zones.rotation.length).to.equal(3);
      expect(board.getState().zones.flex.length).to.equal(0);
    });

    it("should let APP flex off rotation and reset next.patient", () => {
      const appShift = board.getState().shifts[2];
      board.appFlexOff(appShift.id);
      expect(board.getState().zones.rotation.length).to.equal(2);
      expect(board.getState().zones.flex.length).to.equal(1);
      expect(board.getState().next.patient).to.not.equal(appShift.id);
    });

    it("should let APP join and leave FT", () => {
      const newApp = board.addShift(c.providers[3], c.shifts[4]);
      board.joinFT(newApp);
      expect(board.getState().zones.fasttrack.length).to.equal(2);
      board.leaveFT(newApp);
      expect(board.getState().zones.fasttrack.length).to.equal(1);
    });

    it("should move APP next, skipping APP shift", () => {
      // at this point next.sup hasn't moved from first shift to join
      // first shift to join rotation is at end of rotation
      // adds app to front of rotation
      board.appFlexOn(board.getState().zones.flex[0]); // adds app to front of rotation
      board.moveNext("sup", 1); // from last spot to first spot, but should skip app, so second shift id
      expect(board.getState().next.sup).to.equal(board.getState().shifts[1].id);
    });
  });

  describe("Patient Functions", () => {
    it("should assign patients and supervisors", () => {
      // first patient is an APP shift
      const shiftId = board.getState().zones.rotation[0];
      const supId = board.getState().next.sup;
      board.assignPatient(shiftId, "ambo", 10);
      expect(board.findShiftById(shiftId).counts.total).to.equal(1);
      expect(board.findShiftById(supId).counts.total).to.equal(1);
      console.log(board.getState());
    });
  });

  describe("Reset Function", () => {
    it("should remove all shifts and set all pointers to null on reset", () => {
      board.reset();
      expect(board.getState().shifts.length).to.equal(0);
      expect(board.getState().zones.rotation.length).to.equal(0);
      expect(board.getState().zones.flex.length).to.equal(0);
      expect(board.getState().zones.fasttrack.length).to.equal(0);
      expect(board.getState().zones.off.length).to.equal(0);
      expect(board.getState().next.patient).to.equal(null);
      expect(board.getState().next.sup).to.equal(null);
    });
  });
});

// it("should set next.midlevel to null if no docs left on rotation");
// it("should add patient, event, move next.midlevel after staffing w/APP");
// it("should add Doctor that is next APP when assign patient to midlevel");

// it("should add patients to shifts", () => {
//   board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
//   expect(board.getState().shifts[0].counts.total).to.equal(1);
// });

// it("should only move cycle when bonus reached", () => {
//   board.addNewShift(c.doctors[0], { ...c.shifts[0], rotationId: mainId });
//   const startingShift = board.getState().rotations[0].next.patient;
//   board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
//   expect(board.getState().rotations[0].next.patient).to.equal(startingShift);
//   board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
//   expect(board.getState().rotations[0].next.patient).to.equal(startingShift);
//   board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
//   expect(board.getState().rotations[0].next.patient).to.not.equal(
//     startingShift
//   );
// });

// describe("Event Functions", () => {
//   it("should add event for joining rotation", () => {
//     board.addNewShift(c.doctors[0], { ...c.shifts[0], rotationId: mainId });
//     expect(board.getState().events[0].type).to.equal("join");
//   });
//   it("should add event for moving pointer", () => {
//     board.addNewShift(c.doctors[1], { ...c.shifts[1], rotationId: mainId });
//     board.moveNext("patient", mainId, 1);
//     expect(board.getState().events[0].type).to.equal("pointer");
//     expect(board.getState().events[0].shift.doctor.last).to.equal("Blake");
//     board.moveNext("patient", mainId, 1); //skip Voros
//     board.moveNext("patient", mainId, -1); // back to Voros
//     expect(board.getState().events[0].shift.doctor.last).to.equal("Voros");
//   });
//   it("should add event for moving rotation", () => {
//     board.moveShiftToRotation(board.getState().shifts[1].id, ftId);
//     expect(board.getState().events[0].type).to.equal("move");
//   });
//   it("should add event for patient assigment", () => {
//     board.assignPatient(board.getState().shifts[0].id, "ambo", "11");
//     expect(board.getState().events[0].type).to.equal("assign");
//     expect(board.getState().events[0].patient).to.exist;
//   });
//   it("should reassign patients", () => {
//     board.reassignPatient(
//       board.getState().events[0].id,
//       board.getState().shifts[1].id
//     );
//     expect(board.getState().events[0].shift.id).to.equal(
//       board.getState().shifts[1].id
//     ); // new event for reassignment
//     expect(board.getState().events[1].reassign).to.exist; // reassign added to event that was modified
//     expect(board.getState().shifts[0].patients.length).to.equal(0);
//     expect(board.getState().shifts[1].patients.length).to.equal(1);
//   });
//   it("should add event for changing shift order", () => {
//     board.moveShift(board.getState().shifts[1].id, 1);
//     expect(board.getState().events[0].type).to.equal("order");
//     //console.log(JSON.stringify(board.getState()));
//   });
// });

// describe("Reset Function", () => {
//   it("should remove all shifts and set all pointers to null on reset", () => {
//     board.reset();
//     expect(board.getState().shifts.length).to.equal(0);
//     expect(board.getState().rotations[0].next.patient).to.equal(null);
//     expect(board.getState().rotations[0].next.midlevel).to.equal(null);
//   });
// });
// });
