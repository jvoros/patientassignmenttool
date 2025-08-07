import { beforeEach, describe, expect, it, expectTypeOf } from "vitest";
import Board from "../core/board.js";
import dummy from "./dummy.js";
import { makeBoard, lastEvent } from "./dummy.js";

// add types for vitest context
type Context = {
  board: Board;
  shiftId: Shift["id"];
  shiftId2: Shift["id"];
};

describe("Board Controller", () => {
  describe("Make", () => {
    it("should make Board from config params", () => {
      const b = makeBoard();
      expectTypeOf(b).toEqualTypeOf<Board>();
    });
  });

  describe("Sign In", () => {
    // c is vite context for this suite (tests under this describe block)
    beforeEach<Context>((c) => {
      c.board = makeBoard();
    });
    it<Context>("should make new Shifts and add to shift index", (c) => {
      expect(Object.keys(c.board.shifts).length).toBe(1);
    });
    it<Context>("should add new shifts to the zone specified in shift params", (c) => {
      expect(c.board.zones["main"].shifts.length).toBe(1);
    });
    it<Context>("should add an Event for signing in", (c) => {
      const eventId = c.board.timeline[0];
      const event = c.board.events[eventId];
      expect(event.message).toEqual("Jeremy Voros joined Main Rotation");
    });
  });

  describe("Join Zone", () => {
    it("should add shift to specified zone and add Event", () => {
      const board = makeBoard();
      const shiftId = board.zones.main.shifts[0];
      Board.joinZone(board, { shiftId, zoneSlug: "ft" });
      expect(board.zones.ft.shifts[0]).toEqual(shiftId);
      expect(lastEvent(board).message).toEqual("Jeremy Voros joined Fast Track");
    });
    it("should not add to zone if already in zone", () => {
      const board = makeBoard();
      const shiftId = board.zones.main.shifts[0];
      const lastEventId = board.timeline[0];
      Board.joinZone(board, { shiftId, zoneSlug: "main" });
      expect(board.zones.main.shifts.length).toEqual(1);
      expect(board.timeline[0]).toEqual(lastEventId);
    });
  });

  describe("Leave Zone", (c) => {
    beforeEach<Context>((c) => {
      c.board = makeBoard();
      c.shiftId = c.board.zones.main.shifts[0];
      Board.joinZone(c.board, { shiftId: c.shiftId, zoneSlug: "ft" });
    });

    it<Context>("should leave specified zone and add Event", (c) => {
      Board.leaveZone(c.board, { shiftId: c.shiftId, zoneSlug: "main" });
      expect(lastEvent(c.board).message).toEqual("Jeremy Voros left Main Rotation");
    });
    it<Context>("should not allow shift to leave if only in one zone", (c) => {
      Board.leaveZone(c.board, { shiftId: c.shiftId, zoneSlug: "main" });
      expect(() => {
        Board.leaveZone(c.board, { shiftId: c.shiftId, zoneSlug: "ft" });
      }).toThrowError();
    });
  });

  describe("Switch Zones", () => {
    it("should leave one zone, join another and add an Event", () => {
      const board = makeBoard();
      const shiftId = board.zones.main.shifts[0];
      Board.switchZone(board, { shiftId, leaveZoneSlug: "main", joinZoneSlug: "ft" });
      expect(board.zones.main.shifts.length).toEqual(0);
      expect(board.zones.ft.shifts.length).toEqual(1);
      expect(lastEvent(board).message).toEqual(
        "Jeremy Voros switched from Main Rotation to Fast Track"
      );
    });
  });

  describe("Sign Out", (c) => {
    beforeEach<Context>((c) => {
      c.board = makeBoard();
      c.shiftId = c.board.zones.main.shifts[0];
      Board.joinZone(c.board, { shiftId: c.shiftId, zoneSlug: "ft" });
      Board.signOut(c.board, { shiftId: c.shiftId });
    });
    it<Context>("should move signed out shifts to Off Zone", (c) => {
      expect(c.board.zones.off.shifts.length).toEqual(1);
    });
    it<Context>("should remove shift from all other zones", (c) => {
      expect(c.board.zones.main.shifts.length).toEqual(0);
      expect(c.board.zones.ft.shifts.length).toEqual(0);
    });
    it<Context>("should add Event for signing out", (c) => {
      expect(lastEvent(c.board).message).toEqual("Jeremy Voros signed out");
    });
  });

  describe("Delete Shift", (c) => {
    beforeEach<Context>((c) => {
      c.board = makeBoard();
      c.shiftId = c.board.zones.main.shifts[0];
      Board.joinZone(c.board, { shiftId: c.shiftId, zoneSlug: "ft" });
    });
    it<Context>("should delete shift from shift index, and all zones", (c) => {
      Board.deleteShift(c.board, { shiftId: c.shiftId });
      expect(Object.keys(c.board.shifts).length).toBe(0);
      expect(c.board.shifts[c.shiftId]).toBeUndefined();
    });
    it<Context>("should add an event for deletion", (c) => {
      Board.deleteShift(c.board, { shiftId: c.shiftId });
      expect(lastEvent(c.board).message!.includes("Deleted")).toBeTruthy();
    });
    it<Context>("should throw error if shift has patients assigned", (c) => {
      c.board.shifts[c.shiftId].assigned = 1;
      expect(() => {
        Board.deleteShift(c.board, { shiftId: c.shiftId });
      }).toThrowError();
    });
  });

  describe("Adjust Rotation", (c) => {
    beforeEach<Context>((c) => {
      c.board = makeBoard();
      c.shiftId = c.board.zones.main.shifts[0];
      Board.signIn(c.board, { provider: dummy.providers[2], schedule: dummy.schedules[2] });
    });
    it<Context>("should move next pointer forward and add Event", (c) => {
      Board.adjustRotation(c.board, { zoneSlug: "main", which: "next", offset: 1 });
      expect(c.board.zones.main.next).toEqual(1);
      expect(lastEvent(c.board).message!.includes("forward")).toBeTruthy();
    });
    it<Context>("should move super pointer forward and add Event", (c) => {
      Board.adjustRotation(c.board, { zoneSlug: "main", which: "super", offset: 1 });
      expect(c.board.zones.main.super).toEqual(1);
      expect(lastEvent(c.board).message!.includes("supervisor")).toBeTruthy();
    });
    it<Context>("should change event for backward adjustment", (c) => {
      Board.adjustRotation(c.board, { zoneSlug: "main", which: "next", offset: -1 });
      expect(lastEvent(c.board).message!.includes("back")).toBeTruthy();
    });
  });

  describe("Pause Shift", (c) => {
    beforeEach<Context>((c) => {
      c.board = makeBoard();
      c.shiftId = c.board.zones.main.shifts[0];
      Board.togglePause(c.board, { shiftId: c.shiftId });
    });
    it<Context>("should pause a shift and add Event", (c) => {
      expect(c.board.shifts[c.shiftId].status).toEqual("paused");
      expect(lastEvent(c.board).message!.includes("Paused")).toBeTruthy();
    });
    it<Context>("should unpause a shift and add Event", (c) => {
      Board.togglePause(c.board, { shiftId: c.shiftId }); // unpause
      expect(c.board.shifts[c.shiftId].status).toEqual("active");
      expect(lastEvent(c.board).message!.includes("Unpaused")).toBeTruthy();
    });
  });

  describe.todo("Reset", (c) => {});
});
