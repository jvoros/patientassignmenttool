import { describe, it } from "mocha";
import { expect } from "chai";

import createBoardStore from "../server/controllers/board.js";

let board = createBoardStore();
const [mainId, ftId, offId] = board.getState().rotations.map((r) => r.id); // get the uuid for each rotation

const c = {
  doctors: [
    { last: "Voros", first: "Jeremy" },
    { last: "Blake", first: "Kelly" },
    { last: "Kasavana", first: "Brian", app: true },
  ],
  shifts: [
    {
      start: "06:00",
      end: "15:00",
      name: "6 am",
      bonus: 2,
    },
    {
      start: "08:00",
      end: "17:00",
      name: "8 am",
      bonus: 2,
    },
    {
      start: "10:00",
      end: "20:00",
      name: "10 am",
      bonus: 2,
    },
  ],
};

describe("Board Functions", () => {
  it("should initialize correctly", () => {
    expect(Object.keys(board.getState())).to.deep.equal([
      "rotations",
      "shifts",
      "events",
    ]);
  });

  it("should add shifts", () => {
    board.addNewShift(c.doctors[0], {
      ...c.shifts[0],
      rotationId: mainId,
    });

    board.addNewShift(c.doctors[1], {
      ...c.shifts[1],
      rotationId: mainId,
    });

    board.addNewShift(c.doctors[2], {
      ...c.shifts[2],
      rotationId: mainId,
    });

    expect(board.getState().shifts.length).to.equal(3);
    expect(board.getState().shifts[0].order).to.equal(0); // confirms adds at 0
  });

  it("should move next patient shift forward and backward and handle skip APP", () => {
    board.moveNext("patient", mainId, 1); // moves from kasavana to blake and sets skip to true
    expect(board.getState().rotations[0].next.patient).to.equal(
      board.getState().shifts[1].id
    );
    board.moveNext("patient", mainId, 1); // moves from blake to voros
    expect(board.getState().rotations[0].next.patient).to.equal(
      board.getState().shifts[2].id
    );
    board.moveNext("patient", mainId, 1); // moves from voros to kasavan, but skip is set, skips to blake
    expect(board.getState().rotations[0].next.patient).to.equal(
      board.getState().shifts[1].id
    );
    board.moveNext("patient", mainId, -1); // moves from blake back to kasavana, skip should be false after last skip
    expect(board.getState().rotations[0].next.patient).to.equal(
      board.getState().shifts[0].id
    );
    board.moveNext("patient", mainId, -1); // moves from kasavana back around to voros at end of list
    expect(board.getState().rotations[0].next.patient).to.equal(
      board.getState().shifts[2].id
    );
  });

  it("should move APP next, skipping APP shift", () => {
    // midlevel next should be on voros from when first added
    // this should move around rotation, skip Kasavana and end on Blake
    board.moveNext("midlevel", mainId, 1);
    expect(board.getState().rotations[0].next.midlevel).to.equal(
      board.getState().shifts[1].id
    );
  });

  it("should move shifts between rotations, and adjust order and next values", () => {
    // advance so midlevel and pt nexts are same
    board.moveNext("midlevel", mainId, 1);
    const shiftCount = board.getState().shifts.length;
    const nextIds = board.getState().rotations[0].nextPatientShift;
    board.moveShiftToRotation(board.getState().shifts[0].id, ftId);
    expect(board.getState().shifts[0].rotationId).to.equal(ftId);
    expect(board.getState().shifts.length).to.equal(shiftCount);
    expect(board.getState().rotations[0].next.patient).to.not.equal(nextIds);
    expect(board.getState().rotations[0].next.midlevel).to.not.equal(nextIds);
    // see above, shifts should have order 1, 0, 2 before move
    expect(board.getState().shifts[0].order).to.equal(0);
    expect(board.getState().shifts[1].order).to.equal(0); // order less than moved, shouldn't change
    expect(board.getState().shifts[2].order).to.equal(1); // order > moved, should minus
  });

  it("should move shifts within rotations", () => {
    // move shift[0] back to main, now three shifts on main
    board.moveShiftToRotation(board.getState().shifts[0].id, mainId);
    const shiftId = board.getState().shifts[1].id;
    // move up
    board.moveShift(shiftId, 1);
    expect(board.getState().shifts[1].order).to.equal(1);
    expect(board.getState().shifts[0].order).to.equal(0);
    // move down
    board.moveShift(shiftId, -1);
    expect(board.getState().shifts[1].order).to.equal(0);
    expect(board.getState().shifts[0].order).to.equal(1);
    // not down from order 0
    board.moveShift(shiftId, -1);
    expect(board.getState().shifts[1].order).to.equal(0);
    // not up from order 0
    board.moveShift(board.getState().shifts[2].id, 1);
    expect(board.getState().shifts[2].order).to.equal(2);
  });

  it("should set next.midlevel to null if no docs left on rotation");
  it("should add patient, event, move next.midlevel after staffing w/APP");
  it("should add Doctor that is next APP when assign patient to midlevel");

  it("should add patients to shifts", () => {
    board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
    expect(board.getState().shifts[0].counts.total).to.equal(1);
  });

  it("should only move cycle when bonus reached", () => {
    board.addNewShift(c.doctors[0], { ...c.shifts[0], rotationId: mainId });
    const startingShift = board.getState().rotations[0].next.patient;
    board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
    expect(board.getState().rotations[0].next.patient).to.equal(startingShift);
    board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
    expect(board.getState().rotations[0].next.patient).to.equal(startingShift);
    board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
    expect(board.getState().rotations[0].next.patient).to.not.equal(
      startingShift
    );
  });

  describe("Event Functions", () => {
    it("should add event for joining rotation", () => {
      board.addNewShift(c.doctors[0], { ...c.shifts[0], rotationId: mainId });
      expect(board.getState().events[0].type).to.equal("join");
    });
    it("should add event for moving pointer", () => {
      board.addNewShift(c.doctors[1], { ...c.shifts[1], rotationId: mainId });
      board.moveNext("patient", mainId, 1);
      expect(board.getState().events[0].type).to.equal("pointer");
      expect(board.getState().events[0].shift.doctor.last).to.equal("Blake");
      board.moveNext("patient", mainId, 1); //skip Voros
      board.moveNext("patient", mainId, -1); // back to Voros
      expect(board.getState().events[0].shift.doctor.last).to.equal("Voros");
    });
    it("should add event for moving rotation", () => {
      board.moveShiftToRotation(board.getState().shifts[1].id, ftId);
      expect(board.getState().events[0].type).to.equal("move");
    });
    it("should add event for patient assigment", () => {
      board.assignPatient(board.getState().shifts[0].id, "ambo", "11");
      expect(board.getState().events[0].type).to.equal("assign");
      expect(board.getState().events[0].patient).to.exist;
    });
    it("should reassign patients", () => {
      board.reassignPatient(
        board.getState().events[0].id,
        board.getState().shifts[1].id
      );
      expect(board.getState().events[0].shift.id).to.equal(
        board.getState().shifts[1].id
      ); // new event for reassignment
      expect(board.getState().events[1].reassign).to.exist; // reassign added to event that was modified
      expect(board.getState().shifts[0].patients.length).to.equal(0);
      expect(board.getState().shifts[1].patients.length).to.equal(1);
    });
    it("should add event for changing shift order", () => {
      board.moveShift(board.getState().shifts[1].id, 1);
      expect(board.getState().events[0].type).to.equal("order");
      //console.log(JSON.stringify(board.getState()));
    });
  });

  describe("Reset Function", () => {
    it("should remove all shifts and set all pointers to null on reset", () => {
      board.reset();
      expect(board.getState().shifts.length).to.equal(0);
      expect(board.getState().rotations[0].next.patient).to.equal(null);
      expect(board.getState().rotations[0].next.midlevel).to.equal(null);
    });
  });
});
