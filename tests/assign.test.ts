import { beforeEach, describe, expect, it, expectTypeOf } from "vitest";
import Assign from "../core/assign.js";
import Board from "../core/board.js";
import dummy from "./dummy.js";
import { makeBoard, lastEvent } from "./dummy.js";

// add types for vitest context
type Context = {
  board: Board;
  shiftId: Shift["id"];
  shiftId2: Shift["id"];
};

describe("Assign Controller", () => {
  describe("Assign", (c) => {
    beforeEach<Context>((c) => {
      c.board = makeBoard();
      // add app for tests
      Board.signIn(c.board, { schedule: dummy.schedules[1], provider: dummy.providers[1] });
      c.shiftId = c.board.zones.main.shifts[0];
      Assign.toShift(c.board, {
        shiftId: c.shiftId,
        zoneSlug: "main",
        mode: "ft",
        room: "1",
      });
    });
    it<Context>("should assign a patient to the specified shift", (c) => {
      expect(c.board.shifts[c.shiftId].assigned).toEqual(1);
    });
    it<Context>("should create an event", (c) => {
      const e = lastEvent(c.board);
      expect(e.assign).toEqual(c.shiftId);
    });
    it<Context>("should assign a supervisor if needed", (c) => {
      const superId = lastEvent(c.board).super;
      expect(superId).toBeDefined();
      expect(c.board.shifts[superId!].supervised).toEqual(1);
    });
    it.todo("should add patient arrival time to patient index", (c) => {});
  });

  describe("Assign to Shift", () => {
    it("should not advance rotation", () => {
      const board = makeBoard();
      // add app for tests
      Board.signIn(board, { schedule: dummy.schedules[1], provider: dummy.providers[1] });
      const shiftId = board.zones.main.shifts[1]; // assign to non-pointer shift
      Assign.toShift(board, {
        shiftId: shiftId,
        zoneSlug: "main",
        mode: "ft",
        room: "1",
      });
      expect(board.zones.main.next).toEqual(0);
    });
  });

  describe("Assign to Zone", (c) => {
    beforeEach<Context>((c) => {
      c.board = makeBoard();
      // add app for tests
      Board.signIn(c.board, { schedule: dummy.schedules[1], provider: dummy.providers[1] });
      const zone = c.board.zones.main;
      c.shiftId = zone.shifts[zone.next!]; // pointer shift
      Assign.toZone(c.board, {
        zoneSlug: "main",
        mode: "ft",
        room: "1",
      });
    });
    it<Context>("should assign a patient to shift at next pointer", (c) => {
      expect(Board.getShift(c.shiftId, c.board).assigned).toEqual(1);
    });
    it<Context>("should advance next pointer", (c) => {
      expect(c.board.zones.main.next).toEqual(1);
    });
    it<Context>("should trigger skip if needed", (c) => {
      Board.joinZone(c.board, { shiftId: c.shiftId, zoneSlug: "ft" });
      Assign.toZone(c.board, {
        zoneSlug: "ft",
        mode: "ft",
        room: "4",
      });
      const shift = Board.getShift(c.shiftId, c.board);
      console.log(JSON.stringify(c.board));
      expect(shift.status).toEqual("skip");
    });
  });

  describe.todo("Reassign", (c) => {
    it("should add note to original event", (c) => {});
    it("should make a new event", (c) => {});
    it("should decrease count for original shift", (c) => {});
    it("should increase count for new shift", (c) => {});
    it("APP to APP: should keep original supervisor", (c) => {});
    it("APP to DOC: should decrease super count for original supervisor", (c) => {});
    it("DOC to APP: should set doc as supervisor and increase their super count", (c) => {});
  });

  describe.todo("Change Room", (c) => {
    it("should be able to change room");
  });
});
