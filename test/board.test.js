import { describe, it } from "mocha";
import { expect } from "chai";

import {
  makeBoard,
  addShiftToBoard,
  moveShiftToRotation,
} from "../server/controllers/board.js";

const c = {
  doctors: [
    { last: "Voros", first: "Jeremy" },
    { last: "Blake", first: "Kelly" },
    { last: "Kasavana", first: "Brian" },
  ],
  shifts: [
    { start: "06:00", end: "15:00", name: "6 am", bonus: 2 },
    { start: "08:00", end: "17:00", name: "8 am", bonus: 2 },
    { start: "10:00", end: "20:00", name: "10 am", bonus: 2 },
  ],
};

describe("Board Object Tests", () => {
  let board = makeBoard();
  const [mainId, ftId, offId] = board.rotations.map((r) => r.id); // get the uuid for each rotation

  it("should initialize correctly", () => {
    expect(Object.keys(board)).to.deep.equal(["rotations", "shifts", "events"]);
  });

  it("should add shifts", () => {
    board = addShiftToBoard(board, c.doctors[0], c.shifts[0]);
    expect(board.shifts.length).to.equal(1);
  });

  it("should move shifts between rotations", () => {
    const shiftId = board.shifts[0].id;
    board = moveShiftToRotation(board, shiftId, ftId);
    expect(board.shifts[0].rotationId).to.equal(ftId);
  });

  it("should move shifts within rotations");

  it("should move pointer within rotations");

  it("should add patients to rotations");

  it("", () => {});
});
