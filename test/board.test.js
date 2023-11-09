import { describe, it } from "mocha";
import { expect } from "chai";

import createBoardStore from "../server/controllers/board.js";

let board = createBoardStore();
const [mainId, ftId, offId] = board.getState().rotations.map((r) => r.id); // get the uuid for each rotation

const c = {
  doctors: [
    { last: "Voros", first: "Jeremy" },
    { last: "Blake", first: "Kelly" },
    { last: "Kasavana", first: "Brian" },
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
    expect(board.getState().shifts.length).to.equal(2);
    expect(board.getState().shifts[0].order).to.equal(0); // confirms adds at 0
    expect(board.getState().rotations[0].shiftCount).to.equal(2);
  });

  it("should move rotation pointer if usePointer true", () => {
    board.moveRotationPointer(mainId, 1);
    expect(board.getState().rotations[0].pointer).to.equal(1);
    board.moveRotationPointer(mainId, -1);
  });

  it("should add at order 0 if rotation doesn't use pointer, and change order", () => {
    board.addNewShift(c.doctors[1], {
      ...c.shifts[1],
      rotationId: ftId,
    });
    board.addNewShift(c.doctors[1], {
      ...c.shifts[1],
      rotationId: ftId,
    });
    board.addNewShift(c.doctors[1], {
      ...c.shifts[1],
      rotationId: ftId,
    });
    expect(board.getState().shifts[0].order).to.equal(0);
    expect(board.getState().shifts[2].order).to.equal(2);
  });

  it("should add at pointer and change order", () => {
    board.addNewShift(c.doctors[0], {
      ...c.shifts[0],
      rotationId: mainId,
    });
    board.addNewShift(c.doctors[1], {
      ...c.shifts[1],
      rotationId: mainId,
    });

    board.moveRotationPointer(mainId, 1);

    board.addNewShift(c.doctors[2], {
      ...c.shifts[2],
      rotationId: mainId,
    });
    expect(board.getState().shifts[0].order).to.equal(1); // last shift in should be order 1 to match pointer
    expect(board.getState().shifts[1].order).to.equal(0); // second to last shift should still be 0, didn't move
    expect(board.getState().shifts[2].order).to.equal(2); // first shift added should have been pushed to order 2
  });

  it("should move shifts between rotations, and adjust order", () => {
    // relies on board.addNewShift and rotation.removeShift which are tested elsewhere
    // don't need to test internals of pointer movement, etc.
    const shiftCount = board.getState().shifts.length;
    board.moveShiftToRotation(board.getState().shifts[0].id, ftId);
    expect(board.getState().shifts[0].rotationId).to.equal(ftId);
    expect(board.getState().shifts.length).to.equal(shiftCount);
    // see above, shifts should have order 1, 0, 2 before move
    expect(board.getState().shifts[0].order).to.equal(0);
    expect(board.getState().shifts[1].order).to.equal(0); // order less than moved, shouldn't change
    expect(board.getState().shifts[2].order).to.equal(1); // order > moved, should minus
  });

  it("should move shifts within rotations", () => {
    // see above shift[1] is in main rotation with 3 other shifts
    const shiftId = board.getState().shifts[1].id;
    board.moveShift(shiftId, 1);
    // move up
    expect(board.getState().shifts[1].order).to.equal(1);
    expect(board.getState().shifts[2].order).to.equal(0);
    // move down
    board.moveShift(shiftId, -1);
    expect(board.getState().shifts[1].order).to.equal(0);
    expect(board.getState().shifts[2].order).to.equal(1);
    // not down from order 0
    board.moveShift(shiftId, -1);
    expect(board.getState().shifts[1].order).to.equal(0);
    // not up from order 0
    board.moveShift(board.getState().shifts[7].id, 1);
    expect(board.getState().shifts[7].order).to.equal(3);
  });

  it("should add patients to shifts", () => {
    board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
    expect(board.getState().shifts[0].counts.total).to.equal(1);
  });

  it("should only move pointer when bonus reached", () => {
    const startingPointer = board.getState().rotations[0].pointer;
    board.addNewShift(c.doctors[0], { ...c.shifts[0], rotationId: mainId });
    board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
    expect(board.getState().rotations[0].pointer).to.equal(startingPointer);
    board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
    expect(board.getState().rotations[0].pointer).to.equal(startingPointer);
    board.assignPatient(board.getState().shifts[0].id, "fasttrack", "TrA");
    expect(board.getState().rotations[0].pointer).to.equal(startingPointer + 1);
  });

  describe("Event Functions", () => {
    it("should add event for joining rotation", () => {
      board.addNewShift(c.doctors[0], { ...c.shifts[0], rotationId: mainId });
      expect(board.getState().events[0].type).to.equal("join");
    });
    it("should add event for moving pointer", () => {
      board.addNewShift(c.doctors[1], { ...c.shifts[1], rotationId: mainId });
      board.moveRotationPointer(mainId, 1);
      expect(board.getState().events[0].type).to.equal("pointer");
      expect(board.getState().events[0].shift.doctor.last).to.equal("Blake");
      board.moveRotationPointer(mainId, 1); //skip Voros
      board.moveRotationPointer(mainId, -1); // back to Voros
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
      expect(board.getState().events[0].reassign).to.exist;
      expect(board.getState().shifts[0].patients.length).to.equal(0);
      expect(board.getState().shifts[1].patients.length).to.equal(1);
    });
    it("should add event for changing shift order", () => {
      board.moveShift(board.getState().shifts[1].id, 1);
      expect(board.getState().events[0].type).to.equal("order");
      //console.log(JSON.stringify(board.getState()));
    });
  });
  it("", () => {});
});
